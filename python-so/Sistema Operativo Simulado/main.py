from hardware import *
from so import *
import log
from time import sleep


##
##  MAIN 
##
if __name__ == '__main__':
    log.setupLogger()
    log.logger.info('Starting emulator')

    HARDWARE.setup(8)

    HARDWARE.cpu.enable_stats = True

    ## Switch on computer
    HARDWARE.switchOn()

    #Setea scheduler que se va a usar en el test
    #scheduler = FCFSScheduler()
    #scheduler = PrioritySchedulerExp(5)
    scheduler = RoundRobinScheduler(5)

    ## new create the Operative System Kernel
    # "booteamos" el sistema operativo
    kernel = Kernel(scheduler)

    # Espera medio segundo para que todos los programas empiecen en el mismo tick a la vez
    sleep(0.5)

    # Ahora vamos a intentar ejecutar 3 programas a la vez
    ##################
    prg1 = Program([ASM.CPU(2), ASM.IO(), ASM.CPU(3), ASM.IO(), ASM.CPU(2)])
    # prg1 = CPU, CPU, IO, CPU, CPU, CPU, IO, CPU, CPU, EXIT  || Prio = 1

    prg2 = Program([ASM.CPU(7)])
    # prg2 = CPU, CPU, CPU, CPU, CPU, CPU, CPU, EXIT          || Prio = 2

    prg3 = Program([ASM.CPU(4), ASM.IO(), ASM.CPU(1)])
    # prg3 = CPU, CPU, CPU, CPU, IO, CPU, EXIT                || Prio = 3

    prg4 = Program([ASM.CPU(1), ASM.IO(), ASM.CPU(1), ASM.IO(), ASM.CPU(1)])
    # prg4 = CPU, IO, CPU, IO, CPU, EXIT                      || Prio = 4

    prg5 = Program([ASM.CPU(3), ASM.IO(), ASM.CPU(2), ASM.IO(), ASM.CPU(1)])
    # prg5 = CPU, CPU, CPU, IO, CPU, CPU, IO, CPU, EXIT       || Prio = 5

    prg6 = Program([ASM.CPU(5), ASM.IO(), ASM.CPU(2)])
    # prg6 = CPU, CPU, CPU, CPU, CPU, IO, CPU, CPU, EXIT          || Prio = 6


    kernel.fileSystem.write("c:/prg1.exe", prg1)
    kernel.fileSystem.write("c:/prg2.exe", prg2)
    kernel.fileSystem.write("c:/prg3.exe", prg3)
    kernel.fileSystem.write("c:/prg4.exe", prg4)
    kernel.fileSystem.write("c:/prg5.exe", prg5)
    kernel.fileSystem.write("c:/prg6.exe", prg6)

    # ejecutamos los programas a partir de un “path” (con una prioridad x)
    kernel.run("c:/prg1.exe", 3)
    kernel.run("c:/prg2.exe", 2)
    kernel.run("c:/prg3.exe", 1)
    kernel.run("c:/prg4.exe", 3)
    kernel.run("c:/prg5.exe", 4)
    kernel.run("c:/prg6.exe", 4)
    
    # Si se corren estos programas entonces va a lanzar memory error porque ya no quedan frames libres
    # kernel.run("c:/prg6.exe", 3)
    # kernel.run("c:/prg6.exe", 2)
    # kernel.run("c:/prg6.exe", 1)



    # esperamos 60 segundos a que todos los procesos terminen
    sleep(60)

    HARDWARE.switchOff()

    kernel.gantt.print_gantt()






