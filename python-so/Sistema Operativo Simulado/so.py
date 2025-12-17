#!/usr/bin/env python
import math
from enum import Enum
try:                                 #
    from hardware import *           #
except ImportError:                  #
    from .hardware import *          ## from hardware import *
try:                                 #
    import log                       #
except ImportError:                  #
    from . import log                ## import log



## emulates a compiled program
class Program():

    def __init__(self, instructions):
        self._instructions = self.expand(instructions)

    @property
    def instructions(self):
        return self._instructions

    def addInstr(self, instruction):
        self._instructions.append(instruction)

    def expand(self, instructions):
        expanded = []
        for i in instructions:
            if isinstance(i, list):
                ## is a list of instructions
                expanded.extend(i)
            else:
                ## a single instr (a String)
                expanded.append(i)

        ## now test if last instruction is EXIT
        ## if not... add an EXIT as final instruction
        last = expanded[-1]
        if not ASM.isEXIT(last):
            expanded.append(INSTRUCTION_EXIT)

        return expanded

    def __repr__(self):
        return "Program({instructions})".format(instructions=self._instructions)


## emulates an Input/Output device controller (driver)
class IoDeviceController():

    def __init__(self, device):
        self._device = device
        self._waiting_queue = []
        self._currentPCB = None

    def runOperation(self, pcb, instruction):
        pair = {'pcb': pcb, 'instruction': instruction}
        # append: adds the element at the end of the queue
        self._waiting_queue.append(pair)
        # try to send the instruction to hardware's device (if is idle)
        self.__load_from_waiting_queue_if_apply()

    def getFinishedPCB(self):
        finishedPCB = self._currentPCB
        self._currentPCB = None
        self.__load_from_waiting_queue_if_apply()
        return finishedPCB

    def __load_from_waiting_queue_if_apply(self):
        if (len(self._waiting_queue) > 0) and self._device.is_idle:
            ## pop(): extracts (deletes and return) the first element in queue
            pair = self._waiting_queue.pop(0)
            #print(pair)
            pcb = pair['pcb']
            instruction = pair['instruction']
            self._currentPCB = pcb
            self._device.execute(instruction)


    def __repr__(self):
        return "IoDeviceController for {deviceID} running: {currentPCB} waiting: {waiting_queue}".format(deviceID=self._device.deviceId, currentPCB=self._currentPCB, waiting_queue=self._waiting_queue)

## emulates the  Interruptions Handlers
class AbstractInterruptionHandler():
    def __init__(self, kernel):
        self._kernel = kernel

    @property
    def kernel(self):
        return self._kernel

    def execute(self, irq):
        log.logger.error("-- EXECUTE MUST BE OVERRIDEN in class {classname}".format(classname=self.__class__.__name__))


class KillInterruptionHandler(AbstractInterruptionHandler):

    def execute(self, irq):
        # Lo saca de Running y cambia su estado a Terminated
        pcb = self.kernel.getRunningPCB()
        pcb.state = PCBState.TERMINATED

        # CPU queda idle
        HARDWARE.cpu.pc = -1

        self.kernel.memoryManager.freeFrames(pcb.pageTable.values())

        # Si hay alguien en la ready queue, despacharlo
        self.kernel.executeNext()


class IoInInterruptionHandler(AbstractInterruptionHandler):

    def execute(self, irq):
        # Actualiza PCB
        pcb = self.kernel.getRunningPCB()
        self.kernel.getDispatcher().save(pcb)

        # Cambia su estado a Waiting y lo manda correr en el ioDevice
        pcb.state = PCBState.WAITING
        self.kernel.ioDeviceController.runOperation(pcb, irq.parameters)

        # Si hay alguien en la ready queue, despacharlo
        self.kernel.executeNext()


class IoOutInterruptionHandler(AbstractInterruptionHandler):

    def execute(self, irq):
        pcb = self.kernel.ioDeviceController.getFinishedPCB()
        self.kernel.executeIf(pcb)


class NewInterruptionHandler(AbstractInterruptionHandler):

    def execute(self, irq):
        path = irq.parameters['path']
        priority = irq.parameters['priority']
        pageTable = self._kernel.load_program(path)
        pcb = PCB(path, self._kernel.getNewPID(), priority, pageTable)
        self._kernel.addToPCBTable(pcb)
        self._kernel.executeIf(pcb)

class TimeoutInterruptionHandler(AbstractInterruptionHandler):

    def execute(self, irq):
        log.logger.info("####TIMEOUT####")
        self.kernel.timeoutPing(self)

    def timeoutSwitch(self):
        if not self.kernel.isEmpty():
            pcb = self.kernel.getRunningPCB()
            self.kernel.getDispatcher().save(pcb)
            self.kernel.addToReadyQueue(pcb)
            self.kernel.executeNext()

    def expropiateIfMust(self):
        if not self.kernel.isEmpty():
            nextPcb = self.kernel.getNext()
            self.kernel.executeIf(nextPcb)
            

class PageFaultIntHandler(AbstractInterruptionHandler):
    def execute(self, irq):
        pageId = irq.parameters
        pcb = self.kernel.getRunningPCB()
        self.kernel.loader.loadPage(pcb, pageId)


class MemoryManager():

    def __init__(self):
        memSize = HARDWARE.memory.size 
        #Tal vez deberia ser limit pero el mmu esta hardcodeado a 999 por lo que hace mal la division de frames con ese atributo
        frameSize = HARDWARE.mmu.frameSize
        self._freeFrameList = list(range(0, math.floor(memSize / frameSize)))
        self._allocatedFrames = list()

    def allocFrame(self):

        # Si hay frame libre se la devuelve
        if self._freeFrameList:
            freeFrame = self._freeFrameList.pop(0)
            self._allocatedFrames.append(freeFrame)
            return freeFrame

        # Sino hace SWAP
        return self.selectVictim()

    def selectVictim(self):
        freeFrame = self._allocatedFrames.pop(0) # Se elige al primero
        self._allocatedFrames.append(freeFrame) # y se lo encola al final porque fue el ultimo marco en ingresar
        return freeFrame # FIFO
                        # TODO fijarse de implementar algun otro

    def freeFrames(self, frames):
        for frame in frames:
            self._freeFrameList.append(frame)


class FileSystem():
    def __init__(self):
        self._path = dict()

    def write(self, path, program):
        self._path[path] = program

    def read(self, path):
        program = self._path.get(path)

        if program is None:
            raise ValueError("No se encuentra un programa en el path indicado")
        
        return program

# emulates the core of an Operative System
class Kernel():

    def __init__(self, scheduler):
        HARDWARE.mmu.frameSize = 4
        self._pcbTable = PCBTable()
        self._scheduler = scheduler
        self._dispatcher = Dispatcher()
        self._ganttChart = GanttChart()
        self._memoryManager = MemoryManager()
        self._fileSystem = FileSystem()
        self._loader = Loader(self._fileSystem, self._memoryManager)

        ## setup interruption handlers
        killHandler = KillInterruptionHandler(self)
        HARDWARE.interruptVector.register(KILL_INTERRUPTION_TYPE, killHandler)

        ioInHandler = IoInInterruptionHandler(self)
        HARDWARE.interruptVector.register(IO_IN_INTERRUPTION_TYPE, ioInHandler)

        ioOutHandler = IoOutInterruptionHandler(self)
        HARDWARE.interruptVector.register(IO_OUT_INTERRUPTION_TYPE, ioOutHandler)

        newHandler = NewInterruptionHandler(self)
        HARDWARE.interruptVector.register(NEW_INTERRUPTION_TYPE, newHandler)

        timeoutHandler = TimeoutInterruptionHandler(self)
        HARDWARE.interruptVector.register(TIMEOUT_INTERRUPTION_TYPE, timeoutHandler)

        statHandler = StatInterruptionHandler(self)
        HARDWARE.interruptVector.register(STAT_INTERRUPTION_TYPE, statHandler)

        pageFaultHandler = PageFaultIntHandler(self)
        HARDWARE.interruptVector.register(PAGE_FAULT_INTERRUPTION_TYPE, pageFaultHandler)

        ## controls the Hardware's I/O Device
        self._ioDeviceController = IoDeviceController(HARDWARE.ioDevice)

    def getNewPID(self):
        return self._pcbTable.getNewPID() 
    
    def addToPCBTable(self, pcb):
        return self._pcbTable.add(pcb)

    @property
    def ioDeviceController(self):
        return self._ioDeviceController

    @property
    def gantt(self):
        return self._ganttChart

    @property
    def fileSystem(self):
        return self._fileSystem

    @property
    def memoryManager(self):
        return self._memoryManager

    def executeIf(self, pcb):
        if not HARDWARE.cpu.isBusy():
            self.execute(pcb)
        elif self._scheduler.mustExpropiate(pcb, self._pcbTable.runningPcb):
            self._dispatcher.save(self._pcbTable.runningPcb)
            self.addToReadyQueue(self._pcbTable.runningPcb)
            self.execute(pcb)
        else:
            self.addToReadyQueue(pcb)

    def getNext(self):
        return self._scheduler.getNext()

    def addToReadyQueue(self, pcb):
        pcb.state = PCBState.READY
        self._scheduler.add(pcb)        

    def execute(self, pcb):
        self._dispatcher.load(pcb)
        pcb.state = PCBState.RUNNING
        self._pcbTable.runningPcb = pcb

    def getDispatcher(self):
        return self._dispatcher

    @property
    def loader(self):
        return self._loader

    def getPCBTable(self):
        return self._pcbTable
            
    ## emulates a "system call" for programs execution
    def run(self, path, priority):
        parameters = {'path': path, 'priority': priority}
        newIRQ = IRQ(NEW_INTERRUPTION_TYPE, parameters)
        HARDWARE.interruptVector.handle(newIRQ)

    def load_program(self, path):
        return self._loader.load(path)

    def getRunningPCB(self):
        if self._pcbTable.runningPcb is None:
            log.logger.warning("No hay ningun proceso en estado RUNNING")
        return self._pcbTable.runningPcb

    def executeNext(self):
        if not self._scheduler.isEmpty() and HARDWARE.cpu.pc == -1:
            nextPCB = self._scheduler.getNext()
            self.execute(nextPCB)
        elif HARDWARE.cpu.pc != -1:
            log.logger.warning("No se puede despachar otro proceso si ya se está corriendo uno")
        else:
            log.logger.info("No hay procesos en la ready queue")

    def isEmpty(self):
        return self._scheduler.isEmpty()
    
    def timeoutPing(self, handler):
        self._scheduler.timeoutPing(handler)

    def __repr__(self):
        return "Kernel"


class AbstractScheduler():

    def __init__(self):
        pass

    def add(self, pcb):
        log.logger.error("-- ADD MUST BE OVERRIDEN in class {classname}".format(classname=self.__class__.__name__))

    def getNext(self):
        log.logger.error("-- GETNEXT MUST BE OVERRIDEN in class {classname}".format(classname=self.__class__.__name__))

    def isEmpty(self):
        log.logger.error("-- ISEMPTY MUST BE OVERRIDEN in class {classname}".format(classname=self.__class__.__name__))

    def timeoutPing(self, runningPCB):
        pass

    def mustExpropiate(self, pcb, runningPCB):
        return False



class FCFSScheduler(AbstractScheduler):

    def __init__(self):
        super().__init__()
        self._readyQueue = []

    def add(self, pcb):
        self._readyQueue.append(pcb)

    def getNext(self):
        if self.isEmpty():
            return None
        return self._readyQueue.pop(0)

    def isEmpty(self):
        return not self._readyQueue




class PrioritySchedulerNoExp(AbstractScheduler):

    def __init__(self, quantum):
        super().__init__()
        self._readyQueue = [[], [], [], [], []]
        HARDWARE.timer.quantum = quantum

    def add(self, pcb):
        self._readyQueue[pcb.agedPriority].append(pcb)

    def getNext(self):
        for i in range(len(self._readyQueue)):
            if self._readyQueue[i]:
                return self._readyQueue[i].pop(0)
        return None

    def isEmpty(self):
        for queue in self._readyQueue:
            if queue:
                return False
        return True

    def _agePcbs(self):
        for i in range(4):
            agedPcbs = self._readyQueue[i+1]
            for pcb in agedPcbs:
                pcb.agedPriority = pcb.agedPriority - 1
            self._readyQueue[i].extend(agedPcbs)
            self._readyQueue[i+1] = []

    def timeoutPing(self, handler):
        self._agePcbs()
        HARDWARE.timer.reset()

class PrioritySchedulerExp(PrioritySchedulerNoExp):

    def mustExpropiate(self, pcb, runningPCB):
        return pcb.agedPriority < runningPCB.agedPriority
    
    def timeoutPing(self, handler):
        self._agePcbs()
        handler.expropiateIfMust()
        HARDWARE.timer.reset()



class RoundRobinScheduler(AbstractScheduler):

    def __init__(self, quantum):
        super().__init__()
        self._readyQueue = []
        HARDWARE.timer.quantum = quantum

    def add(self, pcb):
        self._readyQueue.append(pcb)

    def getNext(self):
        if self.isEmpty():
            return None
        return self._readyQueue.pop(0)

    def isEmpty(self):
        return not self._readyQueue
    
    def timeoutPing(self, handler):
        handler.timeoutSwitch()



class Loader():

    def __init__(self, fileSystem, memoryManager):
        self._fileSystem = fileSystem
        self._memoryManager = memoryManager


    def load(self, path):
        program = self._fileSystem.read(path)
        instructions = program.instructions
        frameSize = HARDWARE.mmu.frameSize
        numFrames = math.ceil(len(instructions) / frameSize)

        pageTable = dict()
        for i in range(numFrames):
            pageTable[i] = None

        #
        #  page1 = none
        #  page2 = none
        #  page3 = none
        #


        ## page  -  frame  - cargado
        # 1  - none  - false
        # 2 - 3 - false

        # -----
        # 2 - 4 - false


        return pageTable

        # PCB 1
        # page1 = 1 TODO Borrar comentarios y fijarse estos casos

        # PCB2
        # page1 = 1

    def loadPage(self, pcb, pageId):
        # Asigna un nuevo frame para la página faltante
        frame = self._memoryManager.allocFrame()

        # Se lo asigna al pcb y mmu
        pcb.pageTable[pageId] = frame
        HARDWARE.mmu.setPageFrame(pageId, frame)

        # Lo escribo en memoria
        program = self._fileSystem.read(pcb.path)
        frameSize = HARDWARE.mmu.frameSize
        startInstr = pageId * frameSize
        endInstr = startInstr + frameSize
        instructions = program.instructions[startInstr:endInstr]
        frameStartAddr = frame * frameSize
        for offset, instr in enumerate(instructions):
            HARDWARE.memory.write(frameStartAddr + offset, instr)



class Dispatcher():

    def load(self, pcb):
        HARDWARE.cpu.pc = pcb.pc

        HARDWARE.mmu.resetTLB()

        for pageNumber, frameNumber in pcb.pageTable.items():
            HARDWARE.mmu.setPageFrame(pageNumber, frameNumber)

        HARDWARE.timer.reset()
        print("#### LOADING PROGRAM: ", pcb.pid, "####")

    def save(self, pcb):
        pcb.pc = HARDWARE.cpu.pc
        pcb.resetAgedPriority()
        HARDWARE.cpu.pc = -1



class PCBState(Enum):
    NEW = "NEW"
    READY = "READY"
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    TERMINATED = "TERMINATED"

class PCB():

    def __init__(self, path, pid, priority, pageTable):
        self._pid = pid
        self._pc = 0
        self._state = PCBState.NEW
        self._path = path
        self._priority = priority
        self._agedPriority = priority
        self._pageTable = pageTable


    @property
    def pid(self):
        return self._pid
    
    @property
    def pc(self):
        return self._pc

    @pc.setter
    def pc(self, value):
        if type(value) is not int:
            raise ValueError("pc debe ser un valor entero")
        if value < 0:
            raise ValueError("pc no puede ser negativo")
        self._pc = value

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value):
        if type(value) is not PCBState:
            raise ValueError("state debe ser un valor de PCBState")
        self._state = value

    @property
    def path(self):
        return self._path

    @property
    def priority(self):
        return self._priority

    @priority.setter
    def priority(self, value):
        value = self._setInBoundValue(value)
        self._priority = value

    @property
    def agedPriority(self):
        return self._agedPriority

    @agedPriority.setter 
    def agedPriority(self, value):
        value = self._setInBoundValue(value)
        self._agedPriority = value

    @property
    def pageTable(self):
        return self._pageTable

    def resetAgedPriority(self):
        self._agedPriority = self._priority

    def _setInBoundValue(self, value):
        valueIn = min(value, 4)
        valueIn = max(valueIn, 0)
        return valueIn


    def __repr__(self):
        return "PCB(pid={pid}, pc={pc}, state={state}, path={path})".format(pid=self._pid,pc=self._pc, state=self._state, path=self._path)


class PCBTable():

    def __init__(self):
        self._pcbs = []
        self._pid_counter = 0
        self._runningPCB = None

    @property
    def pcbs(self):
        return self._pcbs

    def get(self, pid):
        for pcb in self._pcbs:
            if pcb.pid == pid:
                return pcb
        log.logger.warning("No existe un proceso con ese PID")
        return None

    def add(self, pcb):
        self._pcbs.append(pcb)

    def remove(self, pid):
        self._pcbs = [pcb for pcb in self._pcbs if pcb.pid != pid]

    def getNewPID(self):
        pid = self._pid_counter
        self._pid_counter += 1
        return pid

    def __repr__(self):
        return "PCBTable({pcbs})".format(pcbs=self._pcbs)
    
    @property
    def runningPcb(self):
        return self._runningPCB
    
    @runningPcb.setter
    def runningPcb(self, pcb):
        if not pcb in self._pcbs:
            raise ValueError("Ese proceso no existe")
        self._runningPCB = pcb









#  ----------- DIAGRAMA DE GANTT ---------------

class StatInterruptionHandler(AbstractInterruptionHandler):
    def execute(self, irq):
        tick = HARDWARE.clock.currentTick
        for pcb in self.kernel.getPCBTable().pcbs:
            self.kernel.gantt.log(pcb.pid, pcb.state, tick)


class GanttChart():

    def __init__(self):
        # Diccionario: pid -> lista de (tick, estado)
        self.timeline = {}

    def log(self, pid, estado, tick):
        if pid not in self.timeline:
            self.timeline[pid] = []
        self.timeline[pid].append((tick, estado))

    def print_gantt(self):

        #  DIAGRAMA DE GANTT
        #  PID | TICK 1 | TICK 2 | TICK 3 | TICK 4 | ...
        #   1  |   Run  |   Wai  |  Rea   |  Run   | ...
        #   2  |   Rea  |   Run  |  Run   |  Ter   | ...

        print("DIAGRAMA DE GANTT")

        # -- Header --
        header = "  PID   |"
        max_ticks = 0

        # cantidad de ticks recorridos
        for _, events in self.timeline.items():
            max_tick_from_event = max(tick for tick, _ in events)
            max_ticks = max(max_ticks, max_tick_from_event)

        for tick in range(max_ticks):
            header += " TICK {0:<3}|".format(tick)
        print(header)

        # -- Rows --
        for pid, events in self.timeline.items():
            # PID del procesos
            row = "  {0:<3}   |".format(pid)

            # primeras 3 letras del estado del proceso en el respectivo tick
            event_dict = {tick: estado.value[:3] for tick, estado in events}
            ter_found = False
            for tick in range(max_ticks):
                if ter_found:
                    row += "         |"
                else:
                    estado = event_dict.get(tick, "   ")
                    row += "   {0}   |".format(estado)
                    if estado == "TER":
                        ter_found = True
            print(row)
