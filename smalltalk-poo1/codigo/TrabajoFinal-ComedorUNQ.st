!classDefinition: #ComedorTest category: #'TrabajoFinal-ComedorUNQ'!
TestCase subclass: #ComedorTest
	instanceVariableNames: 'comedor lucas menuDelDia menuEstudiantil barritacereal chango joaco flavio chango2 chango3'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!ComedorTest methodsFor: 'setUp/tearDown' stamp: 'jc 11/27/2024 18:08:41'!
setUp
	
	comedor := Comedor new.
	lucas := Estudiante conNroLegajo: 9814272.
	joaco := PersonalDeUniversidad conNroLegajo: 412968556.
	flavio := ComensalExterno new.
	menuDelDia := MenuDelDia new.
	menuEstudiantil := MenuEstudiantil new.
	barritacereal := ProductoDeGondola conPrecio: 100*peso.
	chango := Chango new.
	chango2 := Chango new.
	chango3 := Chango new.! !


!ComedorTest methodsFor: 'tests' stamp: 'jc 11/13/2024 16:24:31'!
test001_elComedorEstaAbiertoPorqueEsDiaDeSemana
	
	|fecha1|
	fecha1 := November eleventh, 2024. 
	
	Assert isTrue: (comedor estaAbiertoElDia: fecha1).
	
	! !

!ComedorTest methodsFor: 'tests' stamp: 'jc 11/13/2024 16:24:46'!
test002_elComedorEstaCerradoPorqueEsFinDeSemana
	
	|fecha1|
	fecha1 := November tenth, 2024. 
	
	Assert isFalse: (comedor estaAbiertoElDia: fecha1).
	
	! !

!ComedorTest methodsFor: 'tests' stamp: 'jc 11/13/2024 16:25:13'!
test003_elEstudianteLucasSeRegistraEnElComedor
	
	|fecha1|
	fecha1 := November eleventh, 2024.
	
	lucas seRegistraEn: comedor elDia: fecha1.
	
	Assert isTrue: ((comedor sistemaDeComedor) comensalesRegistrados includes: lucas).
	
	! !

!ComedorTest methodsFor: 'tests' stamp: 'jc 11/13/2024 16:25:35'!
test004_elEstudianteLucasNoPuedeRegistrarseEnElComedorPorqueEsFinDeSemana
	
	|fecha1|
	fecha1 := November tenth, 2024.
	
	Assert should: [lucas seRegistraEn: comedor elDia: fecha1] signal: Error withDescription: (comedor mensajeErrorElComedorEstaCerrado).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test005_elEstudianteLucasRealizaUnPedidoConTarjetaDelComedor
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: lucas.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:20'!
test006_elEstudianteLucasPagaElPedidoRegistradoEnElSistemaConObjetoPago
	
	|fecha1 costoDePedidoPendienteDeLucas|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	lucas recargaPlataEnObjetoPago: 3000*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1 alComedor: comedor conElMetodoDePago: lucas objetoPago.
	
	costoDePedidoPendienteDeLucas := (comedor costoRealDelPedidoPendienteDelComensal: lucas).
	
	lucas pagaSuPedidoAlComedor: comedor.
	
	Assert isTrue: (comedor tieneLosPedidosPagados: lucas).
	Assert that: (lucas objetoPago saldo) isEqualTo: (3000*peso) - costoDePedidoPendienteDeLucas.
	Assert that: (comedor plataRecaudada) isEqualTo: costoDePedidoPendienteDeLucas.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test007_elEstudianteLucasNoPuedeRealizarDosPedidosTeniendoUnoPendienteDePago
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 20 / 2024) .

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta .
	

	Assert should: [lucas realizarPedidoDeLosProductos: chango enElDia: fecha2 alComedor: comedor conElMetodoDePago: lucas tarjeta .] signal: Error withDescription: (comedor sistemaDeComedor mensajeErrorComensalNoPuedeRegistrarDosPedidos ).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test008_elEstudianteLucasRealizaUnPedidoConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas objetoPago .
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: lucas.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test009_elEstudianteLucasRealizaUnPedidoConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas efectivo .
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: lucas.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:17'!
test010_elPersonalDeUniversidadJoacoRealizaUnPedidoConTarjetaDelComedor
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: joaco.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test011_elPersonalDeUniversidadJoacoRealizaUnPedidoConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago .
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: joaco.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test012_elPersonalDeUniversidadJoacoRealizaUnPedidoConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.

	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco efectivo .
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: joaco.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test013_elPersonalDeUniversidadJoacoPagaElPedidoRegistradoEnElSistema
	
	|fecha1 costoDePedidoPendienteDeJoaco|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco recargaPlataEnObjetoPago: 3000*peso.
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago .
	
	costoDePedidoPendienteDeJoaco := (comedor costoRealDelPedidoPendienteDelComensal: joaco).
	
	joaco pagaSuPedidoAlComedor: comedor.
	
	Assert isTrue: (comedor tieneLosPedidosPagados: joaco).
	Assert that: (joaco objetoPago saldo) isEqualTo: (3000*peso) - costoDePedidoPendienteDeJoaco.
	Assert that: (comedor plataRecaudada) isEqualTo: costoDePedidoPendienteDeJoaco.
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test014_elPersonalDeUniversidadJoacoNoPuedeRealizarDosPedidosTeniendoUnoPendienteDePago
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 20 / 2024) .

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta .
	

	Assert should: [joaco realizarPedidoDeLosProductos: chango enElDia: fecha2 alComedor: comedor conElMetodoDePago: joaco tarjeta .] signal: Error withDescription: (comedor sistemaDeComedor mensajeErrorComensalNoPuedeRegistrarDosPedidos ).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:20'!
test015_elComensalExternoFlavioRealizaUnPedidoConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	
	comedor stockDe: barritacereal tantasVeces: 2. 
	
	chango añadirProducto: barritacereal .
	
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio objetoPago.
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: flavio.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:20'!
test016_elComensalExternoFlavioRealizaUnPedidoConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	
	chango añadirProducto: barritacereal .
	
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	self assert: (comedor comensalesConPedidosPendientesDelSistema) includes: flavio.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:17'!
test017_elComensalExternoFlavioPagaElPedidoRegistradoEnElSistema
	
	|fecha1 costoDePedidoPendienteDeFlavio|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	
	chango añadirProducto: barritacereal .
	
	flavio recargaPlataEnObjetoPago: 3000*peso.
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio objetoPago .
	
	costoDePedidoPendienteDeFlavio := (comedor costoRealDelPedidoPendienteDelComensal: flavio).
	
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert isTrue: (comedor tieneLosPedidosPagados: flavio).
	Assert that: (flavio objetoPago saldo) isEqualTo: (3000*peso) - costoDePedidoPendienteDeFlavio.
	Assert that: (comedor plataRecaudada) isEqualTo: costoDePedidoPendienteDeFlavio.
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test018_elComensalExternoFlavioNoPuedeRealizarDosPedidosTeniendoUnoPendienteDePago
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 20 / 2024) .
	
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio efectivo .
	

	Assert should: [flavio realizarPedidoDeLosProductos: chango enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo .] signal: Error withDescription: (comedor sistemaDeComedor mensajeErrorComensalNoPuedeRegistrarDosPedidos ).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test019_elComensalExternoFlavioNoPuedeRealizarUnPedidoConAlgunMenu
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	Assert should: [flavio realizarPedidoDeLosProductos: chango enElDia: fecha1 alComedor: comedor conElMetodoDePago: flavio efectivo .] signal: Error withDescription: (comedor sistemaDeComedor mensajeErrorDeComensalExternoPideUnMenu ).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:16'!
test020_elComedorCalculaElCostoEnBrutoDelPedidoDelEstudianteLucasConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas objetoPago .
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: lucas) equals: (2300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test021_elComedorCalculaElCostoEnBrutoDelPedidoDelEstudianteLucasConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas efectivo.
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: lucas) equals: (2300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:20'!
test022_elComedorCalculaElCostoEnBrutoDelPedidoDelEstudianteLucasConTarjetaDeUniversidad
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: lucas) equals: (2300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test023_elComedorCalculaElCostoEnBrutoDelPedidoDelPersonalDeUniversidadJoacoConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago .
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: joaco) equals: (1300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/29/2024 20:09:43'!
test024_elComedorCalculaElCostoEnBrutoDelPedidoDelPersonalDeUniversidadJoacoConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco efectivo .
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: joaco) equals: (1300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test025_elComedorCalculaElCostoEnBrutoDelPedidoDelPersonalDeUniversidadJoacoConTarjeta
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta .
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: joaco) equals: (1300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test026_elComedorCalculaElCostoEnBrutoDelPedidoDelComensalExternoFlavioConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: flavio ) equals: (100*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:17'!
test027_elComedorCalculaElCostoEnBrutoDelPedidoDelComensalExternoFlavioConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio objetoPago.
	
	self assert: (comedor costoEnBrutoDelPedidoPendienteDelComensal: flavio ) equals: (100*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test028_elComedorCalculaElCostoRealDelPedidoDelEstudianteLucasConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas objetoPago .
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: lucas) equals: (2415*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test029_elComedorCalculaElCostoRealDelPedidoDelEstudianteLucasConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas efectivo.
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: lucas) equals: (2300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:20'!
test030_elComedorCalculaElCostoRealDelPedidoDelEstudianteLucasConTarjetaDeUniversidad
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: lucas) equals: (2290*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test031_elComedorCalculaElCostoRealDelPedidoDelPersonalDeUniversidadJoacoConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago .
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: joaco) equals: (1365*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test032_elComedorCalculaElCostoRealDelPedidoDelPersonalDeUniversidadJoacoConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco efectivo .
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: joaco) equals: (1300*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test033_elComedorCalculaElCostoRealDelPedidoDelPersonalDeUniversidadJoacoConTarjeta
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1 alComedor: comedor conElMetodoDePago: joaco tarjeta .
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: joaco) equals: (1055*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:20'!
test034_elComedorCalculaElCostoRealDelPedidoDelComensalExternoFlavioConEfectivo
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	comedor stockDe: barritacereal tantasVeces: 2. 
	
	chango añadirProducto: barritacereal .
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: flavio ) equals: (100*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test035_elComedorCalculaElCostoRealDelPedidoDelComensalExternoFlavioConObjetoPago
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio objetoPago.
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: flavio ) equals: (105*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:17'!
test036_elComedorCalculaElCostoRealDelPedidoDelEstudianteLucasConEfectivoUnLunes
	
	|fecha1|
	fecha1 := (November / 18 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas efectivo.
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: lucas) equals: (2290*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'jc 11/21/2024 17:05:08'!
test037_elComensalExternoNoSePuedeRegistrarEnElSistema
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	Assert should: [flavio seRegistraEn: comedor elDia: fecha1] signal: Error withDescription: (flavio mensajeErrorUnComensalExternoNoPuedeRegistrarse).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:18'!
test038_elComensalExternoNoSePuedePedirNingunMenu
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	Assert should: [flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio efectivo.] signal: Error withDescription: (comedor sistemaDeComedor mensajeErrorDeComensalExternoPideUnMenu).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test039_elComedorCalculaElCostoRealDelPedidoDelComensalExternoFlavioConEfectivoUnLunes
	
	|fecha1|
	fecha1 := (November / 4 / 2024).

	comedor stockDe: barritacereal tantasVeces: 2. 
	
	chango añadirProducto: barritacereal .
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: flavio ) equals: (90*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:17'!
test040_elComedorCalculaElCostoRealDelPedidoDelPersonalDeUniversidadJoacoConEfectivoUnLunes
	
	|fecha1|
	fecha1 := (November / 18 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	
	joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco efectivo .
	
	self assert: (comedor costoRealDelPedidoPendienteDelComensal: joaco) equals: (1290*peso).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:19'!
test041_elPersonalDeUniversidadJoacoNoPuedePedirUnMenuEstudiantil
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	comedor stockDe: menuDelDia tantasVeces: 4.
	comedor stockDe: menuEstudiantil tantasVeces: 3.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	Assert should: [joaco realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago.] signal: Error withDescription: (comedor sistemaDeComedor mensajeErrorComensalQueNoEsEstudianteNoPuedePedirMenuEstudiantil).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test042_elComedorVerificaQueTieneElMismoDineroOMasQueLaSumaDeLosCostosDeLosPedidosYaPagados
	
	|fecha1|
	fecha1 := (November / 13 / 2024).

	lucas seRegistraEn: comedor elDia: fecha1. 
	joaco seRegistraEn: comedor elDia: fecha1. 
	
	comedor stockDe: barritacereal tantasVeces: 23. 
	comedor stockDe: menuDelDia tantasVeces: 56.
	comedor stockDe: menuEstudiantil tantasVeces: 89.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuDelDia .
	chango añadirProducto: menuEstudiantil .
	
	lucas recargaPlataEnObjetoPago: 3000*peso.
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1 alComedor: comedor conElMetodoDePago: lucas objetoPago.
	lucas pagaSuPedidoAlComedor: comedor.
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	joaco recargaPlataEnObjetoPago: 3000*peso.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago .
	joaco pagaSuPedidoAlComedor: comedor.
	
	Assert isTrue: (comedor tieneMasOIgualDineroRecaudadoQueSusPedidosYaPagados).! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:21'!
test043_elComensalExternoFlavioNoPuedePagarSuPedidoPorqueNoTieneDinero
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 2. 
	
	chango añadirProducto: barritacereal .
	
	flavio recargaPlataEnObjetoPago: 2*peso.
	
	flavio realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: flavio objetoPago .
	
	Assert should: [flavio pagaSuPedidoAlComedor: comedor.] signal: Error withDescription: (flavio objetoPago mensajeErrorNoTieneDineroParaPagar).
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test044_losPedidosHechosEnLaFechaUnoSonLosDeLucasYJoaco
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnObjetoPago: 124412*peso.
	lucas recargaPlataEnObjetoPago: 345345*peso.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas objetoPago.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco objetoPago.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor losPedidosConLosFiltros: {FiltroPorFecha deLaFecha: fecha1 }) isEqualTo: ((comedor pedidosDe: lucas) union: (comedor pedidosDe: joaco)) asBag.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test045_losPedidosHechosConElMetodoDePagoSonLosDeLucasYJoaco
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor losPedidosConLosFiltros: {FiltroPorMetodoDePago de: Tarjeta new}) isEqualTo: ((comedor pedidosDe: lucas) union: (comedor pedidosDe: joaco)) asBag.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test046_losPedidosConPrecioRealMayorAMilPesosSonLosDeLucasYJoaco
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor losPedidosConLosFiltros: {FiltroPorPrecioMayor deCosto: (1000*peso) }) isEqualTo: ((comedor pedidosDe: lucas) union: (comedor pedidosDe: joaco)) asBag.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test047_losPedidosHechosPorComensalesExterno
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor losPedidosConLosFiltros: {FiltroPorComensalExterno new}) isEqualTo: (comedor pedidosDe: flavio).! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:43'!
test048_losPedidosHechosConElMetodoDePagoYEnLaFechaUnoSonLosDeLucasYJoaco
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor losPedidosConLosFiltros: {FiltroPorMetodoDePago de: Tarjeta new. FiltroPorFecha deLaFecha: fecha1. }) isEqualTo: ((comedor pedidosDe: lucas) union: (comedor pedidosDe: joaco)) asBag.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test049_losPedidosDeCostoRealMayorADosPesosYDeComensalesExternosEsElDeFlavio
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor losPedidosConLosFiltros: {FiltroPorPrecioMayor deCosto: (2*peso). FiltroPorComensalExterno new }) isEqualTo: (comedor pedidosDe: flavio).! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test050_lasGananciasPorComensalesExternosSonNoventaPesos
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor gananciasTotalesPorComensalesExternos) isEqualTo: (270*peso).! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:47:42'!
test051_lasGananciasPorComensalesUniversitarioSonNoventaPesos
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor gananciasTotalesPorComensalesUniversitario ) isEqualTo: (2145*peso).! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:56:03'!
test052_laCantidadDeMenuEstudiantilesEsTreintaYCinco
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor cantidadDeMenusEstudiantiles ) isEqualTo: 35.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 16:59:31'!
test053_laCantidadDeMenuDelDiaEsCuarentaYTres
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor cantidadDeMenusDelDia) isEqualTo: 43.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 17:12:08'!
test054_laCantidadDePedidoHechosUnLunesPagadosConEfectivo
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor cantidadDePedidosHechosUnLunesPagadosEnEfectivos) isEqualTo: 1.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/28/2024 17:35:20'!
test055_elTipoDeProductoMasPopularEsLaBarritaDeCereal
	
	|fecha1 fecha2|
	fecha1 := (November / 13 / 2024).
	fecha2 := (November / 25 / 2024).
	
	joaco seRegistraEn: comedor elDia: fecha1.
	lucas seRegistraEn: comedor elDia: fecha1.
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	chango2 añadirProducto: barritacereal .
	chango2 añadirProducto: menuDelDia .
	
	chango3 añadirProducto: barritacereal tantasVeces: 3 .	
	
	joaco recargaPlataEnTarjeta: 124412*peso En: comedor .
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	flavio recargaPlataEnEfectivo: 8124*peso.
	
	lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.
	joaco realizarPedidoDeLosProductos: chango2 enElDia: fecha1  alComedor: comedor conElMetodoDePago: joaco tarjeta.
	flavio realizarPedidoDeLosProductos: chango3 enElDia: fecha2 alComedor: comedor conElMetodoDePago: flavio efectivo.
	
	lucas pagaSuPedidoAlComedor: comedor.
	flavio pagaSuPedidoAlComedor: comedor.
	
	Assert that: (comedor productoMasPopular) isEqualTo: barritacereal.! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/30/2024 15:10:09'!
test056_unComensalUniversitarioNoPuedeHacerPedidoYaQueNoEstaRegistrado
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil .
	
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	
	Assert should: [lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.]  signal: Error  withDescription: (comedor sistemaDeComedor mensajeErrorDeComensaluniversitarioSinRegistrarse) 
	
	! !

!ComedorTest methodsFor: 'tests' stamp: 'LNL 11/30/2024 15:14:31'!
test057_unComensalNoPuedeHacerUnPedidoQueContengaMasDeUnMenuEstudiantil
	
	|fecha1|
	fecha1 := (November / 13 / 2024).
	
	lucas seRegistraEn: comedor elDia: fecha1 .
	
	comedor stockDe: barritacereal tantasVeces: 22. 
	comedor stockDe: menuDelDia tantasVeces: 44.
	comedor stockDe: menuEstudiantil tantasVeces: 36.
	
	chango añadirProducto: barritacereal .
	chango añadirProducto: menuEstudiantil tantasVeces: 2 .
	
	lucas recargaPlataEnTarjeta: 345345*peso En: comedor.
	
	Assert should: [lucas realizarPedidoDeLosProductos: chango enElDia: fecha1  alComedor: comedor conElMetodoDePago: lucas tarjeta.]  signal: Error  withDescription: (comedor sistemaDeComedor mensajeErrorMenuEstudiantilPedidoMasDeUnaVez ) 
	
	
	
	! !


!classDefinition: #Chango category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #Chango
	instanceVariableNames: 'productos'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Chango methodsFor: 'initializing' stamp: 'jc 11/21/2024 14:42:21'!
initialize
	
	productos := OrderedCollection new.! !


!Chango methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:47:16'!
añadirProducto: unProducto      
	
	productos add: unProducto .! !

!Chango methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:47:42'!
añadirProducto: unProducto tantasVeces: unaCantidad  

	productos add: unProducto withOccurrences: unaCantidad ! !


!Chango methodsFor: 'accessing' stamp: 'LNL 12/5/2024 14:52:38'!
cantidadDeMenusEstudiantiles
	
	^ productos count: [:pro | pro esMenuEstudiantil] ! !

!Chango methodsFor: 'accessing' stamp: 'LNL 12/5/2024 15:46:01'!
cantidadDelProducto: unProducto

	^ productos occurrencesOf: unProducto.! !

!Chango methodsFor: 'accessing' stamp: 'LNL 11/14/2024 14:54:53'!
productos

	^ productos .! !


!Chango methodsFor: 'testing' stamp: 'LNL 11/20/2024 16:07:05'!
tieneUnMenuEstudiantil

	^ productos anySatisfy: [:produ | produ esMenuEstudiantil]! !


!classDefinition: #Comedor category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #Comedor
	instanceVariableNames: 'sistema stock plataRecaudada'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Comedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 16:16:32'!
esFinDeSemana: unaFecha

	^ (unaFecha isSaturday) or: (unaFecha isSunday)! !

!Comedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 16:16:32'!
estaAbiertoElDia: unaFecha 
	
	^(self esFinDeSemana: unaFecha) not.! !

!Comedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 16:23:51'!
hayStockDeLosProductos: unChango

	^ (unChango productos) allSatisfy: [:pro | (self cantidadEnStockDelProducto: pro) >= (self cantidadEn: unChango DelProducto: pro)].
	

	
	
	! !

!Comedor methodsFor: 'testing' stamp: 'jc 11/27/2024 16:26:09'!
tieneLosPedidosPagados: unComensal 
	
	^ sistema verificaSiNoTienePedidosPendientes: unComensal.! !

!Comedor methodsFor: 'testing' stamp: 'jc 11/27/2024 17:51:46'!
tieneMasOIgualDineroRecaudadoQueSusPedidosYaPagados
	
	^ plataRecaudada >= (sistema dineroTotalDePedidosPagos).! !


!Comedor methodsFor: 'initializing' stamp: 'jc 11/21/2024 17:58:54'!
initialize
	
	sistema := SistemaDelComedor new.
	
	stock := Bag new.
	
	plataRecaudada := 0*peso.! !


!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:15:29'!
arrayDeFiltrosLunesPagadosEnEfectivo

	^ {FiltroPorDiaLunes new . FiltroPorMetodoDePago de: (Efectivo new). FiltroPorPagado new}! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/28/2024 17:01:44'!
cantidadDeMenusDelDia
	
	^ stock count: [:pro | pro esMenuDelDia].! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/28/2024 16:58:36'!
cantidadDeMenusEstudiantiles
	
	^ stock count: [:pro | pro esMenuEstudiantil].! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:14:30'!
cantidadDePedidosHechosUnLunesPagadosEnEfectivos
	
	^ (self losPedidosHechosUnLunesPagadosEnEfectivo) size! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 12/5/2024 15:46:23'!
cantidadEn: unChango DelProducto: unProducto	
	
	^ unChango cantidadDelProducto: unProducto.
	
	! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:22:55'!
cantidadEnStockDelProducto: pro

	^ stock occurrencesOf: pro! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/20/2024 14:07:45'!
comensalesConPedidosPendientesDelSistema
	
	^ sistema comensalesConPedidosPendientes .! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/20/2024 15:56:04'!
costoEnBrutoDelPedidoPendienteDelComensal: unComensal

	^ sistema calcularCostoEnBrutoDelPedidoPendienteDelComensal: unComensal.! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/20/2024 16:15:07'!
costoRealDelPedidoPendienteDelComensal: unComensal
	
	  ^ sistema calcularCostoRealDelPedidoPendienteDelComensal: unComensal.
	! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:17:40'!
gananciasTotalesPorComensalesExternos
	
	^ (self losPedidosDeComensalesExternos) sum: [:pedido | pedido calcularCostoReal]! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:18:25'!
gananciasTotalesPorComensalesUniversitario
	
	^ (self losPedidosPorComensalesUniversitarios ) sum: [:pedido | pedido calcularCostoReal]! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:17:30'!
losPedidosDeComensalesExternos

	^ self losPedidosConLosFiltros: {FiltroPorComensalExterno new}! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:15:30'!
losPedidosHechosUnLunesPagadosEnEfectivo

	^ self losPedidosConLosFiltros: self arrayDeFiltrosLunesPagadosEnEfectivo! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:18:25'!
losPedidosPorComensalesUniversitarios

	^ self losPedidosConLosFiltros: {FiltroPorComensalUniversitario new}! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/28/2024 14:19:46'!
pedidos
	
	^ sistema todosLosPedidos! !

!Comedor methodsFor: 'accessing' stamp: 'jc 11/27/2024 18:47:51'!
pedidosDe: unComensal 
	
	^sistema pedidosDeComensal: unComensal.! !

!Comedor methodsFor: 'accessing' stamp: 'jc 11/27/2024 16:50:30'!
plataRecaudada
	
	^plataRecaudada.! !

!Comedor methodsFor: 'accessing' stamp: 'LNL 11/28/2024 17:20:17'!
productoMasPopular
	
	^ sistema elProductoMasPopular.! !

!Comedor methodsFor: 'accessing' stamp: 'jc 11/13/2024 15:14:52'!
sistemaDeComedor
	
	^sistema.! !


!Comedor methodsFor: 'actions' stamp: 'jc 11/27/2024 16:46:28'!
cobraElPedidoDe: unComensal 
	
	sistema cobraElPedidoDelComensal: unComensal.
	
	plataRecaudada := plataRecaudada + (self costoRealDelPedidoPendienteDelComensal: unComensal).
	
	sistema registrarPedidoComoPagoDe: unComensal.
	
	! !

!Comedor methodsFor: 'actions' stamp: 'LNL 12/5/2024 15:38:18'!
losPedidosConLosFiltros: arrayDeFiltros
	
	^ FiltrosCombinados deLosFiltros: arrayDeFiltros enLosPedidos: (sistema todosLosPedidos). ! !

!Comedor methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:54:12'!
quitarDelStockLosProductos: unChango

	(unChango productos) do: [:pro | stock remove: pro]
	
	
	! !

!Comedor methodsFor: 'actions' stamp: 'jc 11/27/2024 18:03:42'!
recargarTarjetaDe: unComensal Con: unaCantidadDeDinero.	
	 
	unComensal tarjetaEntregadaCon: unaCantidadDeDinero.! !

!Comedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 19:52:53'!
recibeElPedidoConLosProductos: unChango enElDia: unaFecha DelComensal: unComensal conElMetodoDePago: unMetodoDePago.

	self verificacionDePedidoValidoEn: unaFecha con: unChango.
	
	sistema registraElPedidoConLosProductos: unChango enElDia: unaFecha DelComensal: unComensal conElMetodoDePago: unMetodoDePago.
	
	self quitarDelStockLosProductos: unChango.
	
	
	
	! !

!Comedor methodsFor: 'actions' stamp: 'jc 11/21/2024 16:54:33'!
registraA: unComensal elDia: unDia 
	
	(self estaAbiertoElDia: unDia) ifFalse: [self error: (self mensajeErrorElComedorEstaCerrado)].
	
	sistema registraA: unComensal.! !

!Comedor methodsFor: 'actions' stamp: 'LNL 11/14/2024 15:52:00'!
stockDe: unProducto tantasVeces: unaCantidad

	stock add: unProducto withOccurrences: unaCantidad ! !


!Comedor methodsFor: 'error handling' stamp: 'jc 11/13/2024 15:38:06'!
mensajeErrorElComedorEstaCerrado
	
	^'El comedor se encuentra cerrado los fines de semana'.! !

!Comedor methodsFor: 'error handling' stamp: 'LNL 11/14/2024 16:10:44'!
mensajeErrorNoHaySuficienteStock

	^ 'No hay suficiente stock de todos los productos pedidos'! !

!Comedor methodsFor: 'error handling' stamp: 'jc 11/27/2024 15:13:43'!
verificacionDePedidoValidoEn: unaFecha con: unChango

	(self estaAbiertoElDia: unaFecha) ifFalse: [self error: (self mensajeErrorElComedorEstaCerrado)].
	
	(self hayStockDeLosProductos: unChango) ifFalse: [self error: self mensajeErrorNoHaySuficienteStock] .! !


!classDefinition: #Comensal category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #Comensal
	instanceVariableNames: 'efectivo objetoPago'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Comensal methodsFor: 'initializing' stamp: 'jc 11/13/2024 16:35:57'!
initialize
	
	efectivo := Efectivo new.
	objetoPago := ObjetoPago new.! !


!Comensal methodsFor: 'accessing' stamp: 'LNL 11/20/2024 14:37:46'!
efectivo

	^ efectivo.
	! !

!Comensal methodsFor: 'accessing' stamp: 'LNL 11/20/2024 14:37:29'!
objetoPago

	^ objetoPago .
	! !


!Comensal methodsFor: 'testing' stamp: 'LNL 11/14/2024 15:20:00'!
esExterno

	^ self subclassResponsibility .! !


!Comensal methodsFor: 'actions' stamp: 'jc 11/21/2024 15:59:30'!
aplicarPrecioRealDeProductoDeGondola: unProductoDeGondola con: unMetodoDePago enElDia: unaFecha.

	^self subclassResponsibility.! !

!Comensal methodsFor: 'actions' stamp: 'jc 11/27/2024 16:10:59'!
pagaSuPedidoAlComedor: elComedorDeLaUNQ 

	elComedorDeLaUNQ cobraElPedidoDe: self.! !

!Comensal methodsFor: 'actions' stamp: 'LNL 11/14/2024 16:33:52'!
realizarPedidoDeLosProductos: unChango enElDia: unaFecha alComedor: unComedorUNQ conElMetodoDePago: unMetodoDePago
	
	unComedorUNQ recibeElPedidoConLosProductos: unChango enElDia: unaFecha DelComensal: self conElMetodoDePago: unMetodoDePago.! !

!Comensal methodsFor: 'actions' stamp: 'jc 11/27/2024 18:00:20'!
recargaPlataEnEfectivo: unaCantidadDeDinero 
	
	efectivo recargarSaldo: unaCantidadDeDinero.! !

!Comensal methodsFor: 'actions' stamp: 'jc 11/27/2024 16:08:45'!
recargaPlataEnObjetoPago: unaCantidadDeDinero 
	
	objetoPago recargarSaldo: unaCantidadDeDinero.! !


!classDefinition: #ComensalExterno category: #'TrabajoFinal-ComedorUNQ'!
Comensal subclass: #ComensalExterno
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!ComensalExterno methodsFor: 'error handling' stamp: 'jc 11/21/2024 16:56:50'!
mensajeErrorUnComensalExternoNoPuedeRegistrarse

	^ 'Un comensal externo no puede registrarse'! !


!ComensalExterno methodsFor: 'actions' stamp: 'jc 11/21/2024 17:16:52'!
aplicarPrecioRealDeProductoDeGondola: unProductoDeGondola con: unMetodoDePago enElDia: unaFecha 
	
	^unMetodoDePago determinarPrecioDeExternoDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha .! !

!ComensalExterno methodsFor: 'actions' stamp: 'jc 11/21/2024 17:02:34'!
seRegistraEn: elComedorDeLaUNQ elDia: unDia

    ^self error: self mensajeErrorUnComensalExternoNoPuedeRegistrarse.! !


!ComensalExterno methodsFor: 'testing' stamp: 'jc 11/21/2024 17:08:28'!
esEstudiante
	
	^false.! !

!ComensalExterno methodsFor: 'testing' stamp: 'LNL 11/14/2024 15:20:18'!
esExterno

	^ true.! !


!classDefinition: #ComensalUniversitario category: #'TrabajoFinal-ComedorUNQ'!
Comensal subclass: #ComensalUniversitario
	instanceVariableNames: 'numeroDeLegajo tarjeta'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!ComensalUniversitario methodsFor: 'initializing' stamp: 'jc 11/27/2024 15:10:10'!
initializeConNumeroDeLegajo: unNumeroDeLegajo
	
	numeroDeLegajo := unNumeroDeLegajo.
	tarjeta := Tarjeta new.! !


!ComensalUniversitario methodsFor: 'accessing' stamp: 'LNL 11/20/2024 14:41:13'!
tarjeta

	^ tarjeta.! !


!ComensalUniversitario methodsFor: 'actions' stamp: 'jc 11/27/2024 17:10:58'!
habilitaLaTarjeta
	
	tarjeta habilitarse.! !

!ComensalUniversitario methodsFor: 'actions' stamp: 'jc 11/27/2024 18:07:22'!
recargaPlataEnTarjeta: unaCantidadDeDinero En: elComedorDeLaUNQ

	elComedorDeLaUNQ recargarTarjetaDe: self Con: unaCantidadDeDinero.	
	! !

!ComensalUniversitario methodsFor: 'actions' stamp: 'jc 11/13/2024 15:29:32'!
seRegistraEn: elComedorDeLaUNQ elDia: unDia
	
	(elComedorDeLaUNQ) registraA: self elDia: unDia.! !

!ComensalUniversitario methodsFor: 'actions' stamp: 'jc 11/27/2024 18:06:37'!
tarjetaEntregadaCon: unaCantidadDeDinero.
	
	tarjeta recargarSaldo: unaCantidadDeDinero.! !


!ComensalUniversitario methodsFor: 'testing' stamp: 'LNL 11/14/2024 15:20:38'!
esExterno

	^ false.! !

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'ComensalUniversitario class' category: #'TrabajoFinal-ComedorUNQ'!
ComensalUniversitario class
	instanceVariableNames: ''!

!ComensalUniversitario class methodsFor: 'instance creation' stamp: 'jc 11/13/2024 15:04:57'!
conNroLegajo: unNumeroDeLegajo 
	
	^self new initializeConNumeroDeLegajo: unNumeroDeLegajo.! !


!classDefinition: #Estudiante category: #'TrabajoFinal-ComedorUNQ'!
ComensalUniversitario subclass: #Estudiante
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Estudiante methodsFor: 'actions' stamp: 'jc 11/21/2024 16:44:45'!
aplicarPrecioRealDeMenuDelDia: unMenuDelDia con: unMetodoDePago enElDia: unaFecha 
	
	^unMetodoDePago determinarPrecioDeEstudianteDeMenuDelDia: unMenuDelDia enElDia: unaFecha.! !

!Estudiante methodsFor: 'actions' stamp: 'jc 11/21/2024 16:44:51'!
aplicarPrecioRealDeMenuEstudiantil: unMenuEstudiantil con: unMetodoDePago enElDia: unaFecha 
	
	^unMetodoDePago determinarPrecioDeEstudianteDeMenuEstudiantil: unMenuEstudiantil enElDia: unaFecha.! !

!Estudiante methodsFor: 'actions' stamp: 'jc 11/21/2024 16:44:57'!
aplicarPrecioRealDeProductoDeGondola: unProductoDeGondola con: unMetodoDePago enElDia: unaFecha 
	
	^unMetodoDePago determinarPrecioDeEstudianteDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha.! !


!Estudiante methodsFor: 'testing' stamp: 'LNL 11/14/2024 17:03:07'!
esEstudiante

	^ true! !

!Estudiante methodsFor: 'testing' stamp: 'LNL 11/14/2024 17:03:52'!
esPersonalDelaUniversidad

	^ false! !


!classDefinition: #PersonalDeUniversidad category: #'TrabajoFinal-ComedorUNQ'!
ComensalUniversitario subclass: #PersonalDeUniversidad
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!PersonalDeUniversidad methodsFor: 'testing' stamp: 'jc 11/21/2024 16:26:19'!
esEstudiante
	
	^false.! !


!PersonalDeUniversidad methodsFor: 'actions' stamp: 'jc 11/21/2024 16:45:06'!
aplicarPrecioRealDeMenuDelDia: unMenuDelDia con: unMetodoDePago enElDia: unaFecha 
	
	^unMetodoDePago determinarPrecioDePersonalDeMenuDelDia: unMenuDelDia enElDia: unaFecha.! !

!PersonalDeUniversidad methodsFor: 'actions' stamp: 'jc 11/21/2024 16:49:12'!
aplicarPrecioRealDeProductoDeGondola: unProductoDeGondola con: unMetodoDePago enElDia: unaFecha 
	
	^unMetodoDePago determinarPrecioDePersonalDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha. ! !


!classDefinition: #CondicionesParaDias category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #CondicionesParaDias
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!CondicionesParaDias methodsFor: 'testing' stamp: 'LNL 11/28/2024 15:34:01'!
aplicaPara: unaFecha

	^ self subclassResponsibility ! !


!CondicionesParaDias methodsFor: 'accessing' stamp: 'LNL 11/28/2024 15:34:58'!
descuento

	^ self subclassResponsibility ! !


!classDefinition: #CondicionNeutra category: #'TrabajoFinal-ComedorUNQ'!
CondicionesParaDias subclass: #CondicionNeutra
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!CondicionNeutra methodsFor: 'accessing' stamp: 'jc 11/27/2024 16:02:26'!
descuento
	
	^1.! !


!CondicionNeutra methodsFor: 'testing' stamp: 'LNL 11/28/2024 15:21:55'!
aplicaPara: unaFecha
	
	^ true! !


!classDefinition: #CondicionParaLunes category: #'TrabajoFinal-ComedorUNQ'!
CondicionesParaDias subclass: #CondicionParaLunes
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!CondicionParaLunes methodsFor: 'testing' stamp: 'jc 11/27/2024 16:01:24'!
aplicaPara: unaFecha
	
	^unaFecha isMonday.! !


!CondicionParaLunes methodsFor: 'accessing' stamp: 'jc 11/27/2024 16:01:43'!
descuento
	
	^0.9.! !


!classDefinition: #Filtros category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #Filtros
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Filtros methodsFor: 'actions' stamp: 'LNL 11/28/2024 15:56:58'!
filtrarPedidos: unosPedidos
	
	^ self subclassResponsibility ! !


!classDefinition: #FiltroPorComensalExterno category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorComensalExterno
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorComensalExterno methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:13:22'!
filtrarPedidos: unosPedidos

	^ unosPedidos select: [:pedido | pedido esDeComensalExterno]! !


!classDefinition: #FiltroPorComensalUniversitario category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorComensalUniversitario
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorComensalUniversitario methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:25:38'!
filtrarPedidos: unosPedidos

	^ unosPedidos select: [:pedido | pedido esDeComensalUniversitario]! !


!classDefinition: #FiltroPorDiaLunes category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorDiaLunes
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorDiaLunes methodsFor: 'actions' stamp: 'LNL 11/28/2024 17:04:59'!
filtrarPedidos: unosPedidos
	
	^ unosPedidos select: [: pedido | pedido fueRealizadoUnLunes]! !


!classDefinition: #FiltroPorFecha category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorFecha
	instanceVariableNames: 'fecha'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorFecha methodsFor: 'initialization' stamp: 'LNL 11/28/2024 15:47:46'!
initializeDeLaFecha: unaFecha 
	
	fecha := unaFecha.! !


!FiltroPorFecha methodsFor: 'actions' stamp: 'LNL 11/28/2024 15:58:36'!
filtrarPedidos: unosPedidos
	
	^ unosPedidos select: [: pedido | pedido esDeLaFecha: fecha ]! !

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'FiltroPorFecha class' category: #'TrabajoFinal-ComedorUNQ'!
FiltroPorFecha class
	instanceVariableNames: ''!

!FiltroPorFecha class methodsFor: 'instance creation' stamp: 'LNL 11/28/2024 15:47:03'!
deLaFecha: unaFecha
	
	^self new initializeDeLaFecha: unaFecha ! !


!classDefinition: #FiltroPorMetodoDePago category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorMetodoDePago
	instanceVariableNames: 'metodoDePago'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorMetodoDePago methodsFor: 'initialization' stamp: 'LNL 11/28/2024 16:03:46'!
initializeConMetodoDePago: unMetodoDePago 
	
	metodoDePago := unMetodoDePago.! !


!FiltroPorMetodoDePago methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:05:08'!
filtrarPedidos: unosPedidos
	
	^ unosPedidos select: [:pedidos | pedidos esConMetodoDePago: metodoDePago ]! !

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'FiltroPorMetodoDePago class' category: #'TrabajoFinal-ComedorUNQ'!
FiltroPorMetodoDePago class
	instanceVariableNames: ''!

!FiltroPorMetodoDePago class methodsFor: 'instance creation' stamp: 'LNL 11/28/2024 16:03:26'!
de: unMetodoDePago
	
	^self new initializeConMetodoDePago: unMetodoDePago ! !


!classDefinition: #FiltroPorPagado category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorPagado
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorPagado methodsFor: 'actions' stamp: 'LNL 11/28/2024 17:14:43'!
filtrarPedidos: unosPedidos
	
	^ unosPedidos select: [:pedido | pedido estaPagado]! !


!classDefinition: #FiltroPorPrecioMayor category: #'TrabajoFinal-ComedorUNQ'!
Filtros subclass: #FiltroPorPrecioMayor
	instanceVariableNames: 'cantidadDeDinero'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!FiltroPorPrecioMayor methodsFor: 'initialization' stamp: 'LNL 11/28/2024 16:08:44'!
initializeDeCostoReal: unaCantidadDeDinero 
	
	cantidadDeDinero := unaCantidadDeDinero.! !


!FiltroPorPrecioMayor methodsFor: 'actions' stamp: 'LNL 11/28/2024 16:10:23'!
filtrarPedidos: unosPedidos
	
	^ unosPedidos select: [:pedidos | pedidos tieneUnPrecioRealMayorA: cantidadDeDinero ]! !

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'FiltroPorPrecioMayor class' category: #'TrabajoFinal-ComedorUNQ'!
FiltroPorPrecioMayor class
	instanceVariableNames: ''!

!FiltroPorPrecioMayor class methodsFor: 'instance creation' stamp: 'LNL 11/28/2024 16:08:27'!
deCosto: unaCantidadDeDinero
	
	^self new initializeDeCostoReal: unaCantidadDeDinero! !


!classDefinition: #FiltrosCombinados category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #FiltrosCombinados
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'FiltrosCombinados class' category: #'TrabajoFinal-ComedorUNQ'!
FiltrosCombinados class
	instanceVariableNames: ''!

!FiltrosCombinados class methodsFor: 'actions' stamp: 'LNL 12/5/2024 15:12:08'!
conElFiltro: unFiltro filtrarLosPedidos: unosPedidos
	
	^ unFiltro filtrarPedidos: unosPedidos. 
	! !

!FiltrosCombinados class methodsFor: 'actions' stamp: 'LNL 12/5/2024 15:11:01'!
deLosFiltros: unArrayDeFiltros enLosPedidos: unosPedidos
	
	|pedidosFiltrados| 
	
	pedidosFiltrados := unosPedidos .
	
	unArrayDeFiltros do: [:filtro | pedidosFiltrados := (self conElFiltro: filtro filtrarLosPedidos: pedidosFiltrados) ].
	
	^ pedidosFiltrados. 
	
	"Creamos una variable temporal llamada 'pedidosFiltrados' para que se le aplique sucesivamente el filtro siguiente al resultado con el filtro anterior"! !


!classDefinition: #HandlerDeDescuento category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #HandlerDeDescuento
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!HandlerDeDescuento methodsFor: 'actions' stamp: 'LNL 11/29/2024 16:48:17'!
descuentoPara: unaFecha
	
	|condicion|
	
	condicion := (self condiciones detect: [: unaCondicion | unaCondicion aplicaPara: unaFecha]).
	
	^condicion descuento.! !


!HandlerDeDescuento methodsFor: 'accessing' stamp: 'LNL 11/28/2024 15:34:33'!
condiciones

	^{CondicionParaLunes new. CondicionNeutra new.}! !


!classDefinition: #MetodoDePago category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #MetodoDePago
	instanceVariableNames: 'saldo'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!MetodoDePago methodsFor: 'initializing' stamp: 'jc 11/13/2024 16:42:27'!
initialize 
	
	saldo := 0*peso.! !


!MetodoDePago methodsFor: 'accessing' stamp: 'LNL 11/28/2024 14:04:20'!
nombreDelMetodoDePago

	^ self subclassResponsibility ! !

!MetodoDePago methodsFor: 'accessing' stamp: 'jc 11/27/2024 16:39:25'!
saldo
	
	^saldo.! !


!MetodoDePago methodsFor: 'actions' stamp: 'jc 11/27/2024 17:46:59'!
debitar: unaCantidadDeDinero
	
	(self verificarSiElSaldoEsMayorA: unaCantidadDeDinero) ifFalse: [self error: self mensajeErrorNoTieneDineroParaPagar].
	
	saldo := saldo - unaCantidadDeDinero.
	
	! !

!MetodoDePago methodsFor: 'actions' stamp: 'jc 11/27/2024 18:06:12'!
recargarSaldo: unaCantidadDeDinero 
	
	saldo := saldo + unaCantidadDeDinero.! !


!MetodoDePago methodsFor: 'testing' stamp: 'jc 11/27/2024 17:47:39'!
verificarSiElSaldoEsMayorA: unaCantidadDeDinero
	
	^saldo >= unaCantidadDeDinero.! !


!MetodoDePago methodsFor: 'error handling' stamp: 'jc 11/27/2024 17:48:19'!
mensajeErrorNoTieneDineroParaPagar
	
	^'El comensal no tiene dinero para pagar este pedido'.! !


!classDefinition: #Efectivo category: #'TrabajoFinal-ComedorUNQ'!
MetodoDePago subclass: #Efectivo
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Efectivo methodsFor: 'actions' stamp: 'jc 11/21/2024 16:43:05'!
determinarPrecioDeEstudianteDeMenuDelDia: unMenuDelDia enElDia: unaFecha 
	
	^unMenuDelDia precio.! !

!Efectivo methodsFor: 'actions' stamp: 'jc 11/21/2024 16:47:48'!
determinarPrecioDeEstudianteDeMenuEstudiantil: unMenuEstudiantil enElDia: unaFecha 
	
	^unMenuEstudiantil precio.! !

!Efectivo methodsFor: 'actions' stamp: 'jc 11/27/2024 16:04:00'!
determinarPrecioDeEstudianteDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha 
	
	|handler descuentoFinal|
	
	handler := HandlerDeDescuento new.
	
	descuentoFinal := handler descuentoPara: unaFecha.
	
	^(unProductoDeGondola precio) * descuentoFinal.
	
 
	
	
	! !

!Efectivo methodsFor: 'actions' stamp: 'jc 11/27/2024 17:04:11'!
determinarPrecioDeExternoDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha 
	
	|handler descuentoFinal|
	
	handler := HandlerDeDescuento new.
	
	descuentoFinal := handler descuentoPara: unaFecha.
	
	^(unProductoDeGondola precio) * descuentoFinal.
	
 ! !

!Efectivo methodsFor: 'actions' stamp: 'jc 11/21/2024 16:43:46'!
determinarPrecioDePersonalDeMenuDelDia: unMenuDelDia enElDia: unaFecha 
	
	^unMenuDelDia precio.! !

!Efectivo methodsFor: 'actions' stamp: 'jc 11/27/2024 17:04:17'!
determinarPrecioDePersonalDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha 

	|handler descuentoFinal|
	
	handler := HandlerDeDescuento new.
	
	descuentoFinal := handler descuentoPara: unaFecha.
	
	^(unProductoDeGondola precio) * descuentoFinal.
	
 ! !


!Efectivo methodsFor: 'accessing' stamp: 'LNL 11/28/2024 14:03:45'!
nombreDelMetodoDePago

	^ 'Efectivo'! !


!classDefinition: #ObjetoPago category: #'TrabajoFinal-ComedorUNQ'!
MetodoDePago subclass: #ObjetoPago
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!ObjetoPago methodsFor: 'actions' stamp: 'jc 11/21/2024 16:40:50'!
determinarPrecioDeEstudianteDeMenuDelDia: unMenuDelDia enElDia: unaFecha 
	
	^(unMenuDelDia precio) * 1.05.! !

!ObjetoPago methodsFor: 'actions' stamp: 'jc 11/21/2024 16:41:01'!
determinarPrecioDeEstudianteDeMenuEstudiantil: unMenuEstudiantil enElDia: unaFecha 
	
	^(unMenuEstudiantil  precio) * 1.05.! !

!ObjetoPago methodsFor: 'actions' stamp: 'jc 11/21/2024 16:41:10'!
determinarPrecioDeEstudianteDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha
	
	^(unProductoDeGondola precio) * 1.05.! !

!ObjetoPago methodsFor: 'actions' stamp: 'jc 11/21/2024 17:20:53'!
determinarPrecioDeExternoDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha 
	
	^(unProductoDeGondola precio) * 1.05.! !

!ObjetoPago methodsFor: 'actions' stamp: 'jc 11/21/2024 16:42:11'!
determinarPrecioDePersonalDeMenuDelDia: unMenuDelDia enElDia: unaFecha 
	
	^(unMenuDelDia precio) * 1.05.! !

!ObjetoPago methodsFor: 'actions' stamp: 'jc 11/21/2024 16:42:46'!
determinarPrecioDePersonalDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha
	
	^(unProductoDeGondola precio) * 1.05.! !


!ObjetoPago methodsFor: 'accessing' stamp: 'LNL 11/28/2024 14:03:59'!
nombreDelMetodoDePago

	^ 'ObjetoPago'! !


!classDefinition: #Tarjeta category: #'TrabajoFinal-ComedorUNQ'!
MetodoDePago subclass: #Tarjeta
	instanceVariableNames: 'habilitada'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Tarjeta methodsFor: 'accessing' stamp: 'LNL 11/28/2024 14:04:09'!
nombreDelMetodoDePago

	^ 'Tarjeta'! !


!Tarjeta methodsFor: 'initializing' stamp: 'jc 11/27/2024 15:07:01'!
initialize
	
	habilitada := false.
	
	saldo := 0*peso.! !


!Tarjeta methodsFor: 'actions' stamp: 'jc 11/27/2024 15:04:03'!
determinarPrecioDeEstudianteDeMenuDelDia: unMenuDelDia enElDia: unaFecha 
	
	^unMenuDelDia precio! !

!Tarjeta methodsFor: 'actions' stamp: 'jc 11/27/2024 15:04:10'!
determinarPrecioDeEstudianteDeMenuEstudiantil: unMenuEstudiantil enElDia: unaFecha 
	
	^unMenuEstudiantil precio.! !

!Tarjeta methodsFor: 'actions' stamp: 'jc 11/27/2024 15:04:14'!
determinarPrecioDeEstudianteDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha 
	
	^(unProductoDeGondola precio) * 0.9.! !

!Tarjeta methodsFor: 'actions' stamp: 'jc 11/27/2024 15:04:20'!
determinarPrecioDePersonalDeMenuDelDia: unMenuDelDia enElDia: unaFecha 
	
	^(unMenuDelDia precio) * 0.8.! !

!Tarjeta methodsFor: 'actions' stamp: 'jc 11/27/2024 15:04:22'!
determinarPrecioDePersonalDeProductoDeGondola: unProductoDeGondola enElDia: unaFecha 
	
	^(unProductoDeGondola precio) * 0.95.! !

!Tarjeta methodsFor: 'actions' stamp: 'jc 11/27/2024 17:11:20'!
habilitarse
	
	habilitada := true.! !


!classDefinition: #Pedido category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #Pedido
	instanceVariableNames: 'productos fecha comensal metodoDePago pagado'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Pedido methodsFor: 'initializing' stamp: 'jc 11/27/2024 14:59:48'!
initializeDelChango: unChango DelDia: unaFecha DelComensal: unComensal conMetodoDePago: unMetodoDePago

	productos := (unChango productos).
	
	fecha := unaFecha.
	
	comensal := unComensal.
	
	metodoDePago := unMetodoDePago. 
	
	pagado := false.! !


!Pedido methodsFor: 'actions' stamp: 'LNL 11/29/2024 16:56:03'!
calcularCostoEnBruto
	
	^ productos sum: [:produ | produ precio ] ifEmpty: [0 * peso].! !

!Pedido methodsFor: 'actions' stamp: 'jc 11/21/2024 14:24:46'!
calcularCostoReal
	
	^ productos sum: [:produ | produ costoRealDelComensal: comensal ConElMetodoPago: metodoDePago enElDia: fecha] ifEmpty: [0 * peso].! !

!Pedido methodsFor: 'actions' stamp: 'jc 11/27/2024 16:21:45'!
registrarComoPagado
	
	pagado := true.! !


!Pedido methodsFor: 'accessing' stamp: 'jc 11/27/2024 16:49:15'!
metodoDePago
	
	^metodoDePago.! !

!Pedido methodsFor: 'accessing' stamp: 'LNL 11/29/2024 15:35:59'!
productos
	
	^productos! !


!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 16:06:11'!
esConMetodoDePago: unMetodoDePago 
	
	^ (metodoDePago nombreDelMetodoDePago) = (unMetodoDePago nombreDelMetodoDePago)! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 16:13:43'!
esDeComensalExterno
	
	^ comensal esExterno ! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 16:26:07'!
esDeComensalUniversitario
	
	^ (comensal esExterno) not! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 15:59:16'!
esDeLaFecha: unaFecha 
	
	^ fecha = unaFecha ! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 16:00:46'!
esDelComensal: unComensal 
	
	^ comensal = unComensal ! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 17:15:02'!
estaPagado
	
	^ pagado ! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 17:05:44'!
fueRealizadoUnLunes

	^ fecha isMonday ! !

!Pedido methodsFor: 'testing' stamp: 'LNL 11/28/2024 16:11:13'!
tieneUnPrecioRealMayorA: unaCantidadDeDinero

	^ self calcularCostoReal > unaCantidadDeDinero ! !

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'Pedido class' category: #'TrabajoFinal-ComedorUNQ'!
Pedido class
	instanceVariableNames: ''!

!Pedido class methodsFor: 'as yet unclassified' stamp: 'LNL 11/14/2024 16:48:27'!
DelChango: unChango DelDia: unaFecha DelComensal: unComensal conMetodoDePago: unMetodoDePago

	^ self new initializeDelChango: unChango DelDia: unaFecha DelComensal: unComensal conMetodoDePago: unMetodoDePago.! !


!classDefinition: #ProductoDeComedor category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #ProductoDeComedor
	instanceVariableNames: 'precio'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!ProductoDeComedor methodsFor: 'actions' stamp: 'jc 11/21/2024 14:25:28'!
costoRealDelComensal: unComensal ConElMetodoPago: unMetodoDePago enElDia: unaFecha

	^self subclassResponsibility.! !


!ProductoDeComedor methodsFor: 'accessing' stamp: 'jc 11/13/2024 16:44:53'!
precio

	^ precio.! !


!ProductoDeComedor methodsFor: 'testing' stamp: 'LNL 11/14/2024 15:03:15'!
esMenu

	^ self subclassResponsibility .! !

!ProductoDeComedor methodsFor: 'testing' stamp: 'LNL 11/28/2024 17:00:32'!
esMenuDelDia

	^false .! !

!ProductoDeComedor methodsFor: 'testing' stamp: 'LNL 11/14/2024 16:20:30'!
esMenuEstudiantil

	^false .! !


!classDefinition: #Menu category: #'TrabajoFinal-ComedorUNQ'!
ProductoDeComedor subclass: #Menu
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!Menu methodsFor: 'testing' stamp: 'LNL 11/14/2024 15:05:51'!
esMenu

	^ true! !


!Menu methodsFor: 'actions' stamp: 'jc 11/21/2024 14:33:27'!
costoRealDelComensal: unComensal ConElMetodoPago: unMetodoDePago enElDia: unaFecha

	^self subclassResponsibility.
	
	! !


!classDefinition: #MenuDelDia category: #'TrabajoFinal-ComedorUNQ'!
Menu subclass: #MenuDelDia
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!MenuDelDia methodsFor: 'actions' stamp: 'jc 11/21/2024 16:02:52'!
costoRealDelComensal: unComensal ConElMetodoPago: unMetodoDePago enElDia: unaFecha 
	
	^unComensal aplicarPrecioRealDeMenuDelDia: self con: unMetodoDePago enElDia: unaFecha.! !


!MenuDelDia methodsFor: 'testing' stamp: 'LNL 11/28/2024 17:01:19'!
esMenuDelDia
	
	^ true
	! !


!MenuDelDia methodsFor: 'initializing' stamp: 'jc 11/13/2024 16:49:59'!
initialize
	
	precio := 1200*peso.! !


!classDefinition: #MenuEstudiantil category: #'TrabajoFinal-ComedorUNQ'!
Menu subclass: #MenuEstudiantil
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!MenuEstudiantil methodsFor: 'actions' stamp: 'jc 11/21/2024 16:11:30'!
costoRealDelComensal: unComensal ConElMetodoPago: unMetodoDePago enElDia: unaFecha 
	
	^unComensal aplicarPrecioRealDeMenuEstudiantil: self con: unMetodoDePago enElDia: unaFecha.! !


!MenuEstudiantil methodsFor: 'testing' stamp: 'LNL 11/14/2024 16:20:42'!
esMenuEstudiantil

	^ true .! !


!MenuEstudiantil methodsFor: 'initializing' stamp: 'jc 11/13/2024 16:50:27'!
initialize
	
	precio := 1000*peso.! !


!classDefinition: #ProductoDeGondola category: #'TrabajoFinal-ComedorUNQ'!
ProductoDeComedor subclass: #ProductoDeGondola
	instanceVariableNames: ''
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!ProductoDeGondola methodsFor: 'initializing' stamp: 'jc 11/13/2024 16:47:34'!
initializeConPrecio: unPrecio
	
	precio := unPrecio.! !


!ProductoDeGondola methodsFor: 'testing' stamp: 'LNL 11/14/2024 15:06:03'!
esMenu

	^ false! !


!ProductoDeGondola methodsFor: 'actions' stamp: 'jc 11/21/2024 15:58:40'!
costoRealDelComensal: unComensal ConElMetodoPago: unMetodoDePago enElDia: unaFecha 
	
	^unComensal aplicarPrecioRealDeProductoDeGondola: self con: unMetodoDePago enElDia: unaFecha.! !

"-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- "!

!classDefinition: 'ProductoDeGondola class' category: #'TrabajoFinal-ComedorUNQ'!
ProductoDeGondola class
	instanceVariableNames: ''!

!ProductoDeGondola class methodsFor: 'instance creation' stamp: 'jc 11/13/2024 16:46:34'!
conPrecio: unPrecio
	
	^self new initializeConPrecio: unPrecio.! !


!classDefinition: #SistemaDelComedor category: #'TrabajoFinal-ComedorUNQ'!
Object subclass: #SistemaDelComedor
	instanceVariableNames: 'comensalesRegistrados pedidosPendientes pedidosPagados'
	classVariableNames: ''
	poolDictionaries: ''
	category: 'TrabajoFinal-ComedorUNQ'!

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/20/2024 14:22:23'!
mensajeErrorComensalNoPuedeRegistrarDosPedidos

	^ 'No se puede realizar este pedido porque existe un pedido pendiente de pago a nombre de este comensal'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/20/2024 16:16:18'!
mensajeErrorComensalNoTienePedidoPendiente

	^ 'No existe el pedido pendiente de este comensal'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/20/2024 16:08:12'!
mensajeErrorComensalQueNoEsEstudianteNoPuedePedirMenuEstudiantil

	^ 'El comensal no es estudiante y por lo tanto no puede pedir un menu estudiantil'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/14/2024 14:58:05'!
mensajeErrorDeComensalExternoPideUnMenu

	^ 'Un comensal externo no puede hacer un pedido que contenga un menu'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/14/2024 15:33:20'!
mensajeErrorDeComensaluniversitarioSinRegistrarse

	^ 'Un comensal uninversitario no puede realizar pedidos si no se encuentra en el sistema'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/14/2024 16:22:54'!
mensajeErrorMenuEstudiantilPedidoMasDeUnaVez

	^ 'No se puede pedir mas de un menu estudiantil por pedido'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/29/2024 16:04:10'!
mensajeErrorNoHayProductosParaComparar

	^ 'No existen productos para poder comparar'! !

!SistemaDelComedor methodsFor: 'error handling' stamp: 'LNL 11/29/2024 17:31:54'!
verificacionDeTomaDePedidoDelComensal: unComensal conElChango: unChango	

	(self esElComensalExterno: unComensal yHayUnMenuEn: unChango) ifTrue: [self error: self mensajeErrorDeComensalExternoPideUnMenu] .
	
	(self esElComensalUniversitarioyNoEstaRegistrado: unComensal) ifTrue: [self error: self mensajeErrorDeComensaluniversitarioSinRegistrarse].
	
	(self hayMasDeUnMenuEstudiantilEn: unChango) ifTrue: [self error: self mensajeErrorMenuEstudiantilPedidoMasDeUnaVez].
	
	(self tienePedidoPendienteElComensal: unComensal) ifTrue: [self error: self mensajeErrorComensalNoPuedeRegistrarDosPedidos].
	
	(self noEsEstudiante: unComensal  yHayUnMenuEstudiantilEn: unChango) ifTrue: [self error: self mensajeErrorComensalQueNoEsEstudianteNoPuedePedirMenuEstudiantil].! !


!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:11:47'!
esElComensalExterno: unComensal yHayUnMenuEn: unChango

	^ (unComensal esExterno) and: ( self existeUnMenuEnElChango: unChango)! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:19:48'!
esElComensalUniversitarioyNoEstaRegistrado: unComensal 

	^ ((unComensal esExterno) not) and: (self noEstaRegistradoElComensal: unComensal).
	
	! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:11:47'!
existeUnMenuEnElChango: unChango

	^ (unChango productos) anySatisfy: [:pro | pro esMenu]! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 12/5/2024 14:53:06'!
hayMasDeUnMenuEstudiantilEn: unChango
	
	^ unChango cantidadDeMenusEstudiantiles  > 1 .! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:18:17'!
noEsEstudiante: unComensal  yHayUnMenuEstudiantilEn: unChango

	^ ((unComensal esEstudiante) not) and: ( unChango tieneUnMenuEstudiantil). ! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:19:48'!
noEstaRegistradoElComensal: unComensal

	^ (self seEncuentraRegistradoElComensal: unComensal) not! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:19:02'!
seEncuentraRegistradoElComensal: unComensal

	^ comensalesRegistrados includes: unComensal! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:34:05'!
tienePedidoPendienteElComensal: unComensal 
	
	^ (self comensalesConPedidosPendientes) includes: unComensal. 
	! !

!SistemaDelComedor methodsFor: 'testing' stamp: 'LNL 11/29/2024 17:32:23'!
verificaSiNoTienePedidosPendientes: unComensal 
	
	^ (self tienePedidoPendienteElComensal: unComensal) not.! !


!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:15:05'!
agregarPedidoDe: unChango conMetodoDePago: unMetodoDePago hechoPor: unComensal enElDia: unaFecha

	^ pedidosPendientes at: unComensal put:  (self crearPedidoDelComensal: unComensal EnLaFecha: unaFecha DelChango: unChango ConElMetodoDePago: unMetodoDePago)! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:24:07'!
añadirPedidoAPedidosPagados: pedidoPagado

	^ pedidosPagados add: pedidoPagado! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:16:56'!
calcularCostoEnBrutoDelPedidoPendienteDelComensal: unComensal 
	
	^ (self pedidoPendienteDelComensal: unComensal) calcularCostoEnBruto.
	! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:17:03'!
calcularCostoRealDelPedidoPendienteDelComensal: unComensal 
	
	^ (self pedidoPendienteDelComensal: unComensal) calcularCostoReal.! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:13:37'!
cobraElPedidoDelComensal: unComensal
	
	((self pedidoPendienteDelComensal: unComensal) metodoDePago) debitar: (self calcularCostoRealDelPedidoPendienteDelComensal: unComensal).! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:15:05'!
crearPedidoDelComensal: unComensal EnLaFecha: unaFecha DelChango: unChango ConElMetodoDePago: unMetodoDePago

	^ Pedido DelChango: unChango DelDia: unaFecha DelComensal: unComensal conMetodoDePago: unMetodoDePago! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:23:10'!
quitarPedidoPendienteDelComensal: unComensal

	^ pedidosPendientes removeKey: unComensal! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'jc 11/27/2024 15:10:59'!
registraA: unComensalUniversitario 
	
	comensalesRegistrados add: unComensalUniversitario.
	unComensalUniversitario habilitaLaTarjeta.! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'jc 11/27/2024 14:51:28'!
registraElPedidoConLosProductos: unChango enElDia: unaFecha DelComensal: unComensal conElMetodoDePago: unMetodoDePago
	
	self verificacionDeTomaDePedidoDelComensal: unComensal conElChango: unChango	.

	(self agregarPedidoDe: unChango conMetodoDePago: unMetodoDePago hechoPor: unComensal enElDia: unaFecha).
 
	
	! !

!SistemaDelComedor methodsFor: 'actions' stamp: 'LNL 11/29/2024 17:25:45'!
registrarPedidoComoPagoDe: unComensal 
	
	(self pedidoPendienteDelComensal: unComensal) registrarComoPagado.
	
	self añadirPedidoAPedidosPagados: (self pedidoPendienteDelComensal: unComensal).
	
	self quitarPedidoPendienteDelComensal: unComensal.
	
	! !


!SistemaDelComedor methodsFor: 'initializing' stamp: 'LNL 11/14/2024 17:19:55'!
initialize
	
	comensalesRegistrados := Set new.
	
	pedidosPendientes := Dictionary new.
	
	pedidosPagados := Bag new.! !


!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 17:28:06'!
bagsConLosProductosDeTodosLosPedidos

	^ self todosLosPedidos collect: [:pedido | (pedido productos) asBag]
	! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/14/2024 17:39:21'!
comensalesConPedidosPendientes
	
	^pedidosPendientes keys ! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'jc 11/13/2024 15:23:16'!
comensalesRegistrados
	
	^comensalesRegistrados.! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'jc 11/27/2024 17:24:58'!
dineroTotalDePedidosPagos
	
	^pedidosPagados sum: [: pedido | pedido calcularCostoReal].! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:10:16'!
elProductoConMasAparicionesDe: unosProductos

	^ unosProductos detectMax: [:pro | unosProductos occurrencesOf: pro ]! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 16:12:38'!
elProductoMasPopular

	
	^ (self elProductoConMasAparicionesDe: (self todosLosProductosDeLosPedidos)) ifNil: [ self error: self mensajeErrorNoHayProductosParaComparar].
	! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 17:36:19'!
losPedidosPendientes
	
	^ pedidosPendientes values ! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 17:16:30'!
pedidoPendienteDelComensal: unComensal

	^ pedidosPendientes at: unComensal ifAbsent: [self mensajeErrorComensalNoTienePedidoPendiente] .! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 17:22:04'!
pedidosDeComensal: unComensal 
	
	^(self todosLosPedidos) select: [: pedido | pedido esDelComensal: unComensal].! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'jc 11/27/2024 18:31:20'!
pedidosPendientes
	
	^pedidosPendientes.! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 17:35:49'!
todosLosPedidos
	
	^ ((self losPedidosPendientes) union: pedidosPagados) asBag! !

!SistemaDelComedor methodsFor: 'accessing' stamp: 'LNL 11/29/2024 17:27:53'!
todosLosProductosDeLosPedidos
	
	|productos|
	
	productos := Bag new.
	
	(self bagsConLosProductosDeTodosLosPedidos) do: [:bolsa | productos addAll: bolsa].
	
	^ productos
	
	"Juntamos todos los productos de cada pedido en una sola colección"! !
