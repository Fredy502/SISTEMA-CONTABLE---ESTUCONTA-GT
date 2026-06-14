document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // DATOS MAESTROS PROVISIONALES
    // =========================================

    // 10 Usuarios (1 Maestro, 9 Normales)
    const provisionalUsers = {
        'admin_gd': { pass: 'Gd2026!Master', type: 'master' },  // MAESTRO
        'conta1': { pass: 'Conta#34', type: 'normal' },
        'conta2': { pass: 'Conta#89', type: 'normal' },
        'caja1': { pass: 'Caja$12', type: 'normal' },
        'caja2': { pass: 'Caja$77', type: 'normal' },
        'auditor1': { pass: 'Aud@98', type: 'normal' },
        'asistente1': { pass: 'Asis%44', type: 'normal' },
        'gerente_chiq': { pass: 'Chiq!10', type: 'normal' },
        'gerente_sx': { pass: 'SX#20', type: 'normal' },
        'recepcion1': { pass: 'Rec@56', type: 'normal' }
    };

    // 5 Empresas Ficticias de Estuconta
    const ficticiousCompanies = [
        'Estuconta 1, S.A.',
        'Estuconta 2, S.A.',
        'Estuconta 3, S.A.',
        'Estuconta 4, S.A.',
        'Estuconta 5, S.A.'
    ];

    // Variables de sesión actual
    let currentUser = null;
    let currentCompanyName = null;
    let currentPeriod = null;

    // =========================================
    // FASE 1: LÓGICA DE LOGIN (SAP B1)
    // =========================================
    const loginScreen = document.getElementById('sap-login-screen');
    const inputUser = document.getElementById('sap-user');
    const inputPass = document.getElementById('sap-pass');
    const btnLoginOk = document.getElementById('btn-login-ok');

    const handleLogin = () => {
        const user = inputUser.value.trim();
        const pass = inputPass.value;

        if (provisionalUsers[user] && provisionalUsers[user].pass === pass) {
            // Éxito en Login
            currentUser = user;
            // Pasar a Fase 2: Selección
            loginScreen.classList.remove('active');
            showSelectionScreen();
        } else {
            // Fallo en Login
            alert('Fallo en la autenticación. Código de usuario o contraseña incorrectos.');
            inputPass.value = '';
            inputPass.focus();
        }
    };

    btnLoginOk.addEventListener('click', handleLogin);
    // Permitir Login con Enter
    inputPass.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleLogin(); });
    document.getElementById('btn-login-cancel').addEventListener('click', () => {
        if(confirm('¿Desea salir del sistema?')) window.close();
    });


    // =========================================
    // FASE 2: LÓGICA DE SELECCIÓN (SAP B1)
    // =========================================
    const selectionScreen = document.getElementById('sap-selection-screen');
    const selectEmpresa = document.getElementById('sel-empresa');
    const selectAnio = document.getElementById('sel-anio');
    const selectMes = document.getElementById('sel-mes');
    const btnSelOk = document.getElementById('btn-sel-ok');

    const showSelectionScreen = () => {
        selectionScreen.classList.add('active');
        populateDropdowns();
    };

    const populateDropdowns = () => {
        // Poblar Empresas
        ficticiousCompanies.forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp; opt.textContent = emp;
            selectEmpresa.appendChild(opt);
        });

        // Poblar Años (2020 - 2030)
        for (let year = 2026; year >= 2020; year--) {
            const opt = document.createElement('option');
            opt.value = year; opt.textContent = year;
            selectAnio.appendChild(opt);
        }

        // Poblar Meses
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        meses.forEach((mes, index) => {
            const opt = document.createElement('option');
            opt.value = index + 1; opt.textContent = mes;
            if(index === 3) opt.selected = true; // Abril por defecto
            selectMes.appendChild(opt);
        });
    };

    btnSelOk.addEventListener('click', () => {
        currentCompanyName = selectEmpresa.value;
        const anio = selectAnio.value;
        const mesText = selectMes.options[selectMes.selectedIndex].textContent;
        currentPeriod = `${mesText} ${anio}`;

        // Fase 3: Entrar a la App
        selectionScreen.classList.remove('active');
        enterMainApp();
    });

    // =========================================
    // FASE 3: LÓGICA DE LA APP PRINCIPAL
    // =========================================
    const mainAppContainer = document.getElementById('main-app-container');
    const contextDisplay = document.getElementById('sap-context-display');

    const enterMainApp = () => {
        mainAppContainer.classList.add('active');
        // Actualizar Cabecera de Contexto (Estilo SAP)
        contextDisplay.textContent = `${currentCompanyName} | ${currentUser} | ${currentPeriod}`;
        
        // Inicializar módulos que ya teníamos
        renderNomenclatura();
        actualizarDashboard();
        // Cargar filas iniciales de partida
        tbodyPartida.innerHTML = '';
        createRow(); createRow();
    };

    // --- (Aquí sigue la lógica anterior de navegación, nomenclatura, partidas, etc.) ---
    
    // NAVIGATION
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => { header.nextElementSibling.classList.toggle('show'); });
    });

    const navItems = document.querySelectorAll('.nav-item');
    const modules = document.querySelectorAll('.module');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            modules.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            if (targetId === 'consulta-partidas') renderConsultaPartidas();
        });
    });

    // NOMENCLATURA DATOS (Kilométrica, se mantiene igual)
    const rawNomenclatura = `1|ACTIVO|D|P|1
11|ACTIVO CORRIENTE|D|P|2
1101|CAJA Y BANCOS|D|P|3
110101|CAJA GENERAL|D|P|4
11010101|Caja General Chiquimula|D|D|5
11010102|Caja General San Nicolás|D|D|5
11010103|Caja General Sixtino|D|D|5
11010104|Caja General El Frutal|D|D|5
11010105|Caja General MetroNorte|D|D|5
110102|CAJA CHICA|D|P|4
11010201|Caja Chica Chiquimula|D|D|5
11010202|Caja Chica San Nicolás|D|D|5
11010203|Caja Chica Sixtino|D|D|5
11010204|Caja Chica El Frutal|D|D|5
11010205|Caja Chica Oficina|D|D|5
11010206|Caja Chica MetroNorte|D|D|5
110103|BANCOS|D|P|4
11010301|BANTRAB SN Cta 130-005771-0|D|D|5
11010302|G&T CH Cta 46-0011839-8|D|D|5
11010303|INTER SX Cta 8100-41833-0|D|D|5
11010304|BAM EF Cta 30-4019448-2|D|D|5
11010305|BAM Sociedad Cta 30-4018808-0|D|D|5
11010306|BAC CH Cta 902050350|D|D|5
11010307|BAC SN Cta 902050236|D|D|5
11010308|BAC SX Cta 902050210|D|D|5
11010309|BAC EF Cta 902050392|D|D|5
11010310|GYT MN Cta. 46-0013809-7|D|D|5
11010311|BAC MN Cta 902599455|D|D|5
11010312|BAC Q CENTRAL Cta 902821255|D|D|5
11010313|BAC $ CENTRAL Cta 902829977|D|D|5
11010314|GYT Q CENTRAL Cta 051-0026360-6|D|D|5
11010399|Traslado de fondos entre cuentas|D|D|5
110104|DEPÓSITOS EN CIRCULACIÓN|D|P|4
11010401|Dep. en Circulación, BANTRAB 130-005771-0|D|D|5
11010402|Dep. en Circulación, G&T 46-0011839-8|D|D|5
11010403|Dep. en Circulación, INTER 8100-41833-0|D|D|5
11010404|Dep. en Circulación, BAM FR 30-4019448-2|D|D|5
11010405|Dep. Circulación BAM 30-4018808-0|D|D|5
11010406|Dep. Circulación BAC CH 902050350|D|D|5
11010407|Dep. Circulación BAC SN 902050236|D|D|5
11010408|Dep. Circulación BAC SX 902050210|D|D|5
11010409|Dep. Circulación BAC EF 902050392|D|D|5
11010410|Dep. Circulación GYT MN Cta. 46-0013809-7|D|D|5
11010411|Dep. Circulación BAC MN Cta 902599455|D|D|5
11010412|Dep. Circ. BAC Q CENTRAL Cta 902821255|D|D|5
11010413|Dep. Circ BAC $ CENTRAL Cta 902829977|D|D|5
11010414|Dep. Circ GYT Q CENTRAL Cta 051-0026360-6|D|D|5
1102|CUENTAS Y DOCUMENTOS POR COBRAR|D|P|3
110201|CLIENTES|D|P|4
11020101|Clientes Agencias Way|D|D|5
11020102|Clientes ASTEMSA|D|D|5
11020103|Cuentas por Cobrar|D|D|5
11020104|Clientes Ri Bey (Lancasco)|D|D|5
11020105|Clientes UFM|D|D|5
11020106|Clientes Cemaco|D|D|5
11020107|Clientes Rosul|D|D|5
11020108|Clientes Agexport|D|D|5
11020109|Clientes Urgencias Médicas|D|D|5
11020197|Documentos Varios por Cobrar|D|D|5
11020198|Clientes Varios|D|D|5
11020199|Reserva para Cuentas Incobrables|D|D|5
110202|IVA POR COBRAR|D|P|4
11020201|Crédito Fiscal IVA|D|D|5
11020202|Constancia de Exención IVA|D|D|5
110203|OTROS IMPUESTOS|D|P|4
11020301|ISO|D|D|5
11020302|Pagos a Cuenta ISR|D|D|5
11020303|IVA Retenciones por Compensar|D|D|5
11020304|Retenciones ISR Recibidas|D|D|5
110204|CUENTAS POR COBRAR|D|P|4
11020401|Cuentas por Liquidar|D|D|5
11020402|Cheques Rechazados a Pacientes|D|D|5
11020403|Anticipos a Proveedores|D|D|5
11020404|Cuentas por Cobrar Credomatic|D|D|5
11020405|Cuentas por Cobrar Visa|D|D|5
11020406|Impuestos por Liquidar Documentos Pendientes|D|D|5
110205|ANTICIPOS SOBRE SUELDOS|D|P|4
11020501|Anticipos a Asistentes|D|D|5
11020502|Anticipos a Recepcionistas|D|D|5
11020503|Anticipos a Odontólogos|D|D|5
11020504|Anticipos Administrativos|D|D|5
11020505|Anticipos a Gerencia|D|D|5
110206|CUENTAS POR COBRAR ENTRE CLÍNICAS|D|P|4
11020600|Cuentas por Cobrar Corporativo (Corporación)|D|D|5
11020601|Cuentas por Cobrar a Chiquimula (Corporación)|D|D|5
11020602|Cuentas por Cobrar a San Nicolás (Corporación)|D|D|5
11020603|Cuentas por Cobrar a Sixtino (Corporación)|D|D|5
11020604|Cuentas por Cobrar a El Frutal (Corporación)|D|D|5
11020605|Cuentas por Cobrar a MetroNorte (Grupo Corp)|D|D|5
110207|OTRAS CUENTAS POR COBRAR|D|P|4
11020701|Otras Cuentas por Cobrar a Empleados|D|D|5
11020702|Cuentas por Cobrar a Socios AE|D|D|5
11020703|Cuentas por Cobrar a Socios MB|D|D|5
11020704|Cuentas por Cobrar a Nueva S.A. (Grupo Corporativo)|D|D|5
11020705|Cuentas por Cobrar a Corporación|D|D|5
11020706|Cuentas por Cobrar a Socios JAE|D|D|5
11020707|Cuentas por Cobrar a Socios GME|D|D|5
11020708|Cuentas por Cobrar a Socios EMA|D|D|5
1103|GASTOS ANTICIPADOS|D|P|3
110301|GASTOS ANTICIPADOS|D|P|4
11030101|Alquileres Pagados por Anticipado|D|D|5
11030102|Seguros Pagados por Anticipado|D|D|5
11030103|Gastos Médicos Pagados por Anticipado|D|D|5
11030104|Suscripciones Pagados por Anticipado|D|D|5
11030105|Extracción Desechos Pagado por Anticipado|D|D|5
11030106|Mercadeo Pagado por Anticipado|D|D|5
11030107|Anticipos de Mantenimiento y Remodelaciones|D|D|5
11030108|Servicios Pagados por Anticipado|D|D|5
11030109|Anticipo a Laboratorios|D|D|5
11030110|Viáticos por Liquidar|D|D|5
11030111|Gastos por Aplicar|D|D|5
1104|INVENTARIO|D|P|3
110401|INVENTARIO|D|P|4
11040101|Inventario Chiquimula|D|D|5
11040102|Inventario San Nicolás|D|D|5
11040103|Inventario Sixtino|D|D|5
11040104|Inventario El Frutal|D|D|5
11040105|Inventario MetroNorte|D|D|5
12|ACTIVO NO CORRIENTE|D|P|2
1201|PROPIEDAD, PLANTA Y EQUIPO|D|P|3
120101|INMUEBLES|D|P|4
12010101|Mejoras en Instalaciones Arrendadas|D|D|5
12010109|Dep. Acumulada de Mejoras a Instalac Arrendadas|D|D|5
120102|VEHÍCULOS|D|P|4
12010201|Vehículos|D|D|5
12010209|Depreciación Acumulada de Vehículos|D|D|5
120103|MOBILIARIO Y EQUIPO DE OFICINA|D|P|4
12010301|Mobiliario y Equipo de Oficina|D|D|5
12010309|Dep. Acum. de Mobiliario y Equipo de Oficina|D|D|5
120104|MOBILIARIO Y EQUIPO CLÍNICO|D|P|4
12010401|Mobiliario y Equipo Clínico|D|D|5
12010409|Dep. Acum.de Mobiliario y Equipo Clínico|D|D|5
120105|INSTRUMENTAL ODONTOLÓGICO|D|P|4
12010501|Instrumental Odontológico|D|D|5
12010509|Dep. Acum. de Instrumental Odontológico|D|D|5
120106|EQUIPO DE COMPUTACIÓN|D|P|4
12010601|Equipo de Computación|D|D|5
12010609|Dep. Acum. de Equipo de Computación|D|D|5
1202|DIFERIDO|D|P|3
120201|GASTOS DE ORGANIZACIÓN|D|P|4
12020101|Gastos de Organización|D|D|5
12020109|Amortización Acum. Gastos de Organización|D|D|5
120202|GASTOS DE INSTALACIÓN|D|P|4
12020201|Gastos de Instalación|D|D|5
12020209|Amortización Acum. de Gastos de Instalación|D|D|5
120203|SOFTWARE DE GESTIÓN CLÍNICA|D|P|4
12020301|Software GrupoDent (desarrollado a la medida)|D|D|5
12020399|Amortización Acum. de Software Propio|D|D|5
1203|INVERSIONES|D|P|3
120301|INVERSIONES|D|P|4
12030101|Inversiones|D|D|5
1204|OTROS ACTIVOS|D|P|3
120401|OTROS ACTIVOS|D|P|4
12040101|Depósitos en Garantía|D|D|5
12040102|Certificaciones Internacionales|D|D|5
12040103|Licencias de Software|D|D|5
12040198|Amortización Acum. Licencias Software|D|D|5
12040199|Amortización Acum.Certificaciones Internac.|D|D|5
2|PASIVO|A|P|1
21|PASIVO CORRIENTE|A|P|2
2101|PRÉSTAMOS A CORTO PLAZO|A|P|3
210101|PRÉSTAMOS A CORTO PLAZO|A|P|4
21010101|Préstamo Corto Plazo|A|D|5
2102|PROVEEDORES|A|P|3
210201|PROVEEDORES MATERIALES E INSUMOS|A|P|4
21020101|IMFOHSA|A|D|5
21020102|DENTECO|A|D|5
21020103|GIL|A|D|5
21020104|IDS / Farmen|A|D|5
21020105|Magno Dental|A|D|5
21020106|Xeladent|A|D|5
21020107|Droguería Landivar|A|D|5
21020108|Marisa|A|D|5
21020198|Proveedores de Materiales Varios|A|D|5
210202|PROVEEDORES DE LABORATORIOS|A|P|4
21020201|Laboratorio Luis Álvarez|A|D|5
21020202|Dr. Otto Guerra|A|D|5
21020203|Laboratorio Fuentes|A|D|5
21020204|Laboratorio Técnica y Arte|A|D|5
21020205|Laboratorio Orthod|A|D|5
21020206|Laboratorio Dental Guerra|A|D|5
21020298|Laboratorios Varios|A|D|5
2103|CUENTAS POR PAGAR ENTRE CLINICAS|A|P|3
210301|CUENTAS POR PAGAR ENTRE CLINICAS|A|P|4
21030100|Cuentas por Pagar Corporativo|A|D|5
21030101|Cuentas por Pagar a Chiquimula|A|D|5
21030102|Cuentas por Pagar a San Nicolás|A|D|5
21030103|Cuentas por Pagar a Sixtino|A|D|5
21030104|Cuentas por Pagar a El Frutal|A|D|5
21030105|Cuentas por Pagar a MetroNorte|A|D|5
2104|CUENTAS POR PAGAR|A|P|3
210401|CUENTAS VARIAS POR PAGAR|A|P|4
21040101|Seguros por Pagar|A|D|5
21040102|Gastos Médicos por Pagar|A|D|5
21040103|Grupo Golán por Pagar|A|D|5
21040104|Mercadeo y Publicidad por Pagar|A|D|5
21040105|Cuentas Varias por Pagar|A|D|5
21040106|Mantenimiento y Remodelac por Pagar|A|D|5
21040107|PUBLICAR por Pagar|A|D|5
21040108|Gastos Frecuentes por Pagar|A|D|5
21040109|Cuentas por pagar por compra de activos|A|D|5
21040110|Cuentas por Pagar Telefónica|A|D|5
21040111|Regalías por pagar|A|D|5
21040112|Documentos Varios por Pagar|A|D|5
21040113|Otras Cuentas por Pagar a Empleados|A|D|5
210402|SUELDOS POR PAGAR|A|P|4
21040201|Sueldos por Pagar a Asistentes|A|D|5
21040202|Sueldos por Pagar a Recepcionistas|A|D|5
21040203|Sueldos por Pagar a Odontólogos|A|D|5
21040204|Sueldos por Pagar Administrativos|A|D|5
21040205|Sueldos por Pagar a Socios|A|D|5
210403|BONIF DTO. COMPLEMENTO POR PAGAR|A|P|4
21040301|Bonif. Dto Complemento por Pagar Asistentes|A|D|5
21040302|Bonif. Dto Complemento por Pagar Recepcionistas|A|D|5
21040303|Bonif. Dto Complemento por Pagar Administrativos|A|D|5
210404|HONORARIOS POR PAGAR|A|P|4
21040401|Honorarios por Pagar Administrativos|A|D|5
21040402|Honorarios por Pagar a Odontólogos IF|A|D|5
21040403|Honorarios por Pagar a Odontólogos IIC|A|D|5
21040404|Honorarios por Pagar a Especialistas IF|A|D|5
21040405|Honorarios por Pagar a Especialistas IIC|A|D|5
21040406|Honorarios por Pagar a Gerencia|A|D|5
21040407|Honorarios por Pagar a Consultores|A|D|5
210405|IVA POR PAGAR|A|P|4
21040501|Débito Fiscal IVA|A|D|5
210406|ISR NETO POR PAGAR|A|P|4
21040601|ISR Neto Por Pagar|A|D|5
210407|RETENCIONES POR PAGAR|A|P|4
21040701|Retenciones ISR a Terceros por Pagar|A|D|5
21040702|Retenciones ISR por Pagar Facturas Especiales|A|D|5
21040703|Retenciones ISR a Empleados por Pagar|A|D|5
21040704|Retenciones IVA por Pagar - Fact Especiales|A|D|5
21040705|Retenciones ISR a No Residentes por Pagar|A|D|5
210408|IGSS POR PAGAR|A|P|4
21040801|IGSS por Pagar Patronal|A|D|5
21040802|IGSS por Pagar Laboral|A|D|5
210409|OTRAS CONTRIBUCIONES POR PAGAR|A|P|4
21040901|IUSI por Pagar|A|D|5
21040902|Boletos de Ornato por Pagar|A|D|5
210410|PROVISIÓN DE AGUINALDO|A|P|4
21041001|Provisión de Aguinaldo de Asistentes|A|D|5
21041002|Provisión de Aguinaldo de Recepcionistas|A|D|5
21041003|Provisión de Aguinaldo de Odontólogos|A|D|5
21041004|Provisión de Aguinaldo Administrativos|A|D|5
21041005|Provisión Aguinaldo Serv Cliente, Mkt, Ventas|D|D|5
210411|PROVISIÓN DE BONO 14|A|P|4
21041101|Provisión de Bono 14 de Asistentes|A|D|5
21041102|Provisión de Bono 14 de Recepcionistas|A|D|5
21041103|Provisión de Bono 14 de Odontólogos|A|D|5
21041104|Provisión de Bono 14 Administrativos|A|D|5
21041105|Provisión Bono 14 Serv Cliente, Mkt, Ventas|A|D|5
210412|PRESTACIONES POR PAGAR|A|P|4
21041201|Obligaciones por Pagar por Sustitución Patronal|A|D|5
21041202|Prestaciones por Pagar|A|D|5
2105|OTRAS CUENTAS POR PAGAR|A|P|3
210501|OTRAS CUENTAS POR PAGAR|A|P|4
21050101|Cuentas por Pagar a Socios AE|A|D|5
21050102|Cuentas por Pagar a Socios MB|A|D|5
21050103|Otros Anticipos (F+A)|A|D|5
21050104|Ingresos por Identificar|A|D|5
21050105|Cheques Rechazados por Emitir|A|D|5
21050106|Devoluciones sobre Ventas por Pagar|A|D|5
21050107|Dietas por Pagar|A|D|5
22|PASIVO NO CORRIENTE|A|P|2
2201|PRÉSTAMOS A LARGO PLAZO|A|P|3
220101|PRESTAMOS A LARGO PLAZO|A|P|4
22010101|Préstamo Largo Plazo|A|D|5
2202|PROVISIÓN A INDEMNIZACIONES|A|P|3
220201|PROVISIÓN A INDEMNIZACIONES|A|P|4
22020101|Provisión a Indemnizaciones|A|D|5
3|CAPITAL Y RESULTADOS|A|P|1
31|CAPITAL|A|P|2
3101|CAPITAL|A|P|3
310101|CAPITAL|A|P|4
31010101|Capital Social|A|D|5
31010102|Acciones no Suscritas|A|D|5
31010103|Capital Suscrito y Pagado|A|D|5
31010104|Aportaciones Socios|A|D|5
32|UTILIDADES|A|P|2
3201|UTILIDADES|A|P|3
320101|UTILIDADES|A|P|4
32010101|Utilidades o Pérdidas Retenidas Ej. Anteriores|A|D|5
32010102|Utilidades o Pérdidas Del Ejercicio|A|D|5
32010103|Resultado periodo 2015|A|D|5
32010104|Resultado período 2016|A|D|5
32010105|Resultado del Período EF|A|P|5
32010106|Resultado período 2017|A|D|5
32010107|Resultado período 2018|A|D|5
33|RESERVAS|A|P|2
3301|RESERVAS|A|P|3
330101|RESERVAS|A|P|4
33010101|Reserva Legal|A|D|5
33010102|Otras Reservas|A|D|5
39|RESULTADO DEL EJERCICIO|A|P|2
3901|RESULTADO DEL EJERCICIO|A|P|3
4|INGRESOS|A|P|1
41|SERVICIOS ODONTOLÓGICOS|A|P|2
4101|SERVICIOS ODONTOLÓGICOS|A|P|3
410101|SERVICIOS ODONTOLOGICOS|A|P|4
41010101|Servicios Odontológicos Prestados|A|D|5
41010102|Servicios Profesionales|A|D|5
41010103|Servicios Varios|A|D|5
41010104|Servicios Dentales|A|D|5
42|DEV. Y REBAJAS SOBRE VENTAS|A|P|2
4201|DEV. Y REBAJAS SOBRE VENTAS|A|P|3
420101|DEV. Y REBAJAS SOBRE VENTAS|A|P|4
42010101|Dev. y Rebajas sobre Servicios Odontológicos Prestados|A|D|5
5|COSTO DE VENTAS|D|P|1
51|COSTO DIRECTO DEL SERVICIO|D|P|2
5101|COMPRA DE MATERIAL ODONTOLÓGICO|D|P|3
510101|COMPRA DE MATERIAL ODONTOLÓGICO|D|P|4
51010101|Compra de Materiales|D|D|5
51010102|Dev., Rebajas y Desc. sobre Compra de Materiales|D|D|5
5102|COMPRA DE INSUMOS|D|P|3
510201|COMPRA DE INSUMOS|D|P|4
51020101|Compra de Insumos|D|D|5
51020102|Dev., Rebajas y Desc. sobre Compra de Insumos|D|D|5
5103|LABORATORIOS|D|P|3
510301|LABORATORIOS|D|P|4
51030101|Laboratorios|D|D|5
51030102|Dev., Rebajas y Desc. sobre Laboratorios|D|D|5
5104|SERVICIOS DE DIAGNÓSTICO|D|P|3
510401|SERVICIOS DE DIAGNÓSTICO|D|P|4
51040101|Serv. de Diagnóstico y Plan de Tratamiento|D|D|5
5105|SUELDOS DE CLÍNICA|D|P|3
510501|SUELDOS DE CLÍNICA|D|P|4
51050101|Sueldos de Asistentes|D|D|5
51050102|Sueldos de Recepcionistas de Clínicas|D|D|5
51050199|Descuentos a Sueldos de Clínica|D|D|5
5106|BONIFICACIÓN INCENTIVO DE CLÍNICAS|D|P|3
510601|BONIFICACIÓN INCENTIVO DE CLÍNICAS|D|P|4
51060101|Bonificación Incentivo de Asistentes|D|D|5
51060102|Bonif. Incentivo de Recepcionistas Clínicas|D|D|5
5107|HORAS EXTRAS DE CLÍNICAS|D|P|3
510701|HORAS EXTRAS DE CLÍNICAS|D|P|4
51070101|Horas Extras de Asistentes|D|D|5
51070102|Horas Extras de Recepcionistas de Clínicas|D|D|5
5108|BONIF. 78-89 Y 37-2001 COMPLEMENTO CLÍNICAS|D|P|3
510801|BONIF. CLÍNICAS 78-89 Y 37-2001 COMPLEMENTO|D|P|4
51080101|Bonif. 78.89 y 37-2001 Complemento Asistentes|D|D|5
51080102|Bonif. 78.89 y 37-2001 Complemento Recepcionistas Clínicas|D|D|5
5109|OTRAS BONIFICACIONES|D|P|3
510901|OTRAS BONIFICACIONES|D|P|4
51090101|Otras Bonificaciones de Asistentes|D|D|5
51090102|Otras Bonificaciones Recepcionistas Clínicas|D|D|5
51090103|Bonificaciones GrupoDent a Asistentes|D|D|5
51090104|Bonificaciones GrupoDent a Recepcionistas|D|D|5
5110|PRESTACIONES LABORALES CLÍNICAS|D|P|3
511001|BONOS 14|D|P|4
51100101|Bonos 14 de Asistentes|D|D|5
51100102|Bonos 14 de Recepcionistas|D|D|5
511002|AGUINALDOS|D|P|4
51100201|Aguinaldos de Asistentes|D|D|5
51100202|Aguinaldos de Recepcionistas|D|D|5
511003|VACACIONES|D|P|4
51100301|Vacaciones de Asistentes|D|D|5
51100302|Vacaciones de Recepcionistas|D|D|5
511004|INDEMNIZACIONES|D|P|4
51100401|Indemnizaciones de Asistentes|D|D|5
51100402|Indemnizaciones de Recepcionistas|D|D|5
511005|CUOTA PATRONAL|D|P|4
51100501|Cuota Patronal de Asistentes|D|D|5
51100502|Cuota Patronal de Recepcionistas|D|D|5
5111|HONORARIOS DE CLÍNICA|D|P|3
511101|HONORARIOS  ODONTÓLOGOS GENERALES|D|P|4
51110101|Honorarios Odontólogos - Tipo IF|D|D|5
51110102|Honorarios Odontólogos - Tipo IIC|D|D|5
51110103|Honorarios GrupoDent|D|D|5
511102|HONORARIOS DE ESPECIALISTAS|D|P|4
51110201|Honorarios Especialistas - Tipo IF|D|D|5
51110202|Honorarios Especialistas - Tipo IIC|D|D|5
511103|HONORARIOS DE GERENCIA CLÍNICA|D|P|4
51110301|Honorarios Gerencia Clínica - Tipo IF|D|D|5
51110302|Honorarios Gerencia Clínica - Tipo IIC|D|D|5
5112|VIÁTICOS DE PERSONAL CLÍNICO|D|P|3
511201|VIÁTICOS DE PERSONAL CLÍNICO|D|P|4
51120101|Viáticos de Alimentación del Personal Clínico|D|D|5
51120102|Viáticos de Transporte del Personal Clínico|D|D|5
51120103|Viáticos de Hospedaje del Personal Clínico|D|D|5
51120104|Viáticos Varios del Personal Clínico|D|D|5
5113|GASTOS DE REPRESENTACIÓN CLÍNICA|D|P|3
511301|GASTOS DE REPRESENTACIÓN CLÍNICA|D|P|4
51130101|Gastos de Representación de Clínica|D|D|5
5114|ALQUILERES DE CLÍNICA|D|P|3
511401|ALQUILERES DE CLÍNICA|D|P|4
51140101|Alquiler de Local de Clínica|D|D|5
5115|GASTOS DE MANTTO. Y REPARACIONES|D|P|3
511501|GASTOS DE MANTTO. Y REPARACIONES|D|P|4
51150101|Cuota de Mantenimiento Local Clínica|D|D|5
51150102|Mantenimiento y Reparación de Equipo Clínico|D|D|5
5116|SEGUROS Y FIANZAS DE CLÍNICA|D|P|3
511601|SEGUROS Y FIANZAS DE CLÍNICA|D|P|4
51160101|Seguro de Cobertura Médica en Clínica|D|D|5
5117|AGUA POTABLE DE CLÍNICA|D|P|3
511701|AGUA POTABLE CLÍNICA|D|P|4
51170101|Agua Potable de Clínica|D|D|5
5118|ENERGÍA ELÉCTRICA DE CLÍNICA|D|P|3
511801|ENERGÍA ELÉCTRICA DE CLÍNICA|D|P|4
51180101|Energía Eléctrica de Clínica|D|D|5
5119|TELEFONÍA DE CLÍNICA|D|P|3
511901|TELEFONÍA FIJA DE CLÍNICA|D|P|4
51190101|Teléfono 7942-7292 (CH)|D|D|5
51190102|Teléfono 7942-4856 (CH)|D|D|5
51190103|Teléfono 2434-3575 (SN)|D|D|5
51190104|Teléfono 2484-8124 (SN)|D|D|5
51190105|Teléfono 2484-8125 (SN)|D|D|5
51190106|Teléfono 2269-7140 (SX)|D|D|5
51190107|Teléfono 2269-7141 (SX)|D|D|5
51190108|Teléfono 2269-7143 (Internet SX 1307)|D|D|5
51190109|Teléfono 6640-4931 (EF)|D|D|5
51190110|Teléfono 6640-4761 (EF)|D|D|5
51190111|Teléfono 2278-1840 (SX Internet)|D|D|5
51190112|Teléfono 2235-0840 (MN)|D|D|5
511902|TELEFONÍA MÓVIL DE CLÍNICA|D|P|4
51190201|Telefonía móvil de Recepción|D|D|5
5120|SERVICIO DE CABLE DE CLÍNICA|D|P|3
512001|SERVICIO DE CABLE DE CLÍNICA|D|P|4
51200101|Servicio de Cable de Clínica|D|D|5
5121|CUOTAS Y SUSCRIPCIONES DE CLÍNICA|D|P|3
512101|CUOTAS Y SUSCRIPCIONES DE CLÍNICA|D|P|4
51210101|Cuotas y Suscripciones de Clínica|D|D|5
5122|COMBUSTIBLES Y LUBRICANTES|D|P|3
512201|COMBUSTIBLES Y LUBRICANTES|D|P|4
51220101|Combustibles y Lubricantes Clínica|D|D|5
5123|PAPELERÍA Y ÚTILES DE CLÍNICA|D|P|3
512301|PAPELERÍA Y ÚTILES DE CLÍNICA|D|P|4
51230101|Papelería y Útiles de Clínica|D|D|5
5124|MAT. Y ÚTILES DE LIMPIEZA DE CLÍNICA|D|P|3
512401|MAT. Y ÚTILES DE LIMPIEZA DE CLÍNICA|D|P|4
51240101|Materiales y Útiles de Limpieza de Clínica|D|D|5
5125|GASTOS DE ATENCIÓN AL CLIENTE|D|P|3
512501|GASTOS DE ATENCIÓN AL CLIENTE|D|P|4
51250101|Gastos de Atención al Cliente|D|D|5
5126|PARQ. CLIENTES / PERSONAL CLÍNICO|D|P|3
512601|PARQ. CLIENTES/ PERSONAL CLÍNICO|D|P|4
51260101|Parqueo para Clientes/ Personal Clínico|D|D|5
5127|DEP. Y AMORTIZACIONES CLÍNICA|D|P|3
512701|DEP. Y AMORTIZACIONES DE CLÍNICA|D|P|4
51270101|Dep. y Amortizaciones Mejoras a Locales Alquilados|D|D|5
51270102|Dep. y Amortizaciones Mob. y Equipo Clínico|D|D|5
51270103|Dep. y Amortizaciones Inst. Odontológico|D|D|5
51270104|Amortizaciones Certificaciones Internacionales|D|D|5
5128|SERVICIOS DE EXTRACCIÓN DESECHOS|D|P|3
512801|SERVICIOS DE EXTRACCIÓN DESECHOS|D|P|4
51280101|Extracción de Basura|D|D|5
51280102|Extracción de Desechos Médicos|D|D|5
5129|IMPUESTOS Y CONTRIBUCIONES CLÍNICA|D|P|3
512901|IMPUESTOS Y CONTRIBUCIONES CLÍNICA|D|P|4
51290101|Impuestos y Contribuciones Clínica|D|D|5
51290102|ISR Gasto (No Deducible)|D|D|5
5130|GASTO INSTRUMENTAL Y EQUIPO CLÍNICO|D|P|3
513001|GASTO INSTRUM. Y EQ. CLÍNICO|D|P|4
51300101|Instrumental Gasto|D|D|5
51300102|Mob y Equipo Clínico Gasto|D|D|5
51300199|Dev y Reb S/Instrumental o Mob y Eq Clínico Gasto|D|D|5
5197|GASTOS NO DEDUCIBLES DE CLÍNICA|D|P|3
519701|GASTOS NO DEDUCIBLES DE CLÍNICA|D|P|4
51970101|GND Clínica|D|D|5
51970102|GND Laboratorios|D|D|5
51970103|GND Servicios en Clínica recibidos|D|D|5
51970104|GND Mantto Y Rep de Mob y Eq en Clínica|D|D|5
51970105|GND Remod y Mant. Instalaciones Clínica|D|D|5
51970106|GND de Transporte Personal Clínico|D|D|5
51970107|GND Viaticos Varios Clínica|D|D|5
51970108|GND de Atención al paciente|D|D|5
5198|GASTOS VARIOS DE CLÍNICA|D|P|3
519801|GASTOS VARIOS DE CLÍNICA|D|P|4
51980101|Gastos Varios de Clínica|D|D|5
51980102|Servicios Recibidos en Clínica|D|D|5
51980103|Gastos de Atención Personal Clínico|D|D|5
6|COSTOS DE OPERACIÓN|D|P|1
61|GASTOS DE VENTA|D|P|2
6101|GASTOS DE VENTA|D|P|3
610101|SUELDO SERV/CLIENTE, MERC Y VENTA|D|P|4
61010101|Sueldos Serv. al Cliente, Mercadeo y Ventas|D|D|5
610102|BONIF.INC SERV/CLIENTE, MERC, VENTA|D|P|4
61010201|Bonif. Incentivo Serv/Cliente, Merca y Ventas|D|D|5
610103|HRS. EXT. SERV/CLIENTE, MERC, VENTA|D|P|4
61010301|Horas Extras Servicio Cliente, Merca y Ventas|D|D|5
610104|BONIF. DTO COMPL SERV/CLIENTE, MKT/VENTAS|D|P|4
61010401|Bonif. 78.89 y 37-2001 Complemento Serv Cliente, MKT/Ventas|D|D|5
610105|OTRAS BONIF. SERV/C, MERCA, VENTAS|D|P|4
61010501|Otras Bonif. Servicio Cliente, Merca y Ventas|D|D|5
610106|PREST. SERV/CLIENTE, MERCA, VENTAS|D|P|4
61010601|Bono 14 Servicio al Cliente, Merca y Ventas|D|D|5
61010602|Aguinaldos Servicio Cliente, Merca y Ventas|D|D|5
61010603|Vacaciones Servicio Cliente, Merca y Ventas|D|D|5
61010604|Indem. Servicio Cliente, Merca y Ventas|D|D|5
61010605|Cuota Pat. Servicio Cliente, Merca y Ventas|D|D|5
610107|HONOR. SERV/CLIENTE, MERCA, VENTAS|D|P|4
61010701|Honorarios Serv. al Cliente, Mercad y Ventas|D|D|5
610108|CONS. SERV/CLIENTE, MERCA Y VENTAS|D|P|4
61010801|Consultorías Servicio Cliente, Merca y Ventas|D|D|5
610109|MERCADEO|D|P|4
61010901|Promociones|D|D|5
61010902|Publicidad|D|D|5
61010903|Diseño Publicitario|D|D|5
61010904|Descuentos Sobre Mercadeo|D|D|5
61010905|Gastos de Jornadas a Empresa|D|D|5
61010906|Combustibles Mercadeo|D|D|5
610110|MERCADEO DIGITAL|D|P|4
61011001|Administración de Redes Sociales|D|D|5
61011002|Campañas Digitales de Mercadeo|D|D|5
61011003|Publicidad Digital|D|D|5
610111|COMISIONES POR PROMOCIONES|D|P|4
61011101|Bienchilero - Comisión|D|D|5
61011102|Cucupons - Comisión|D|D|5
61011103|Cupón Club - Comisión|D|D|5
61011104|Club BI - Comisión|D|D|5
61011105|Ri Bey - Comisión|D|D|5
610112|VIÁTICOS SERV/CLIENTE, MERC, VENTAS|D|P|4
61011201|Viát. Alimen. Serv/Cliente, Merca y Ventas|D|D|5
61011202|Viát.Transporte Serv/Cliente, Merca y Ventas|D|D|5
61011203|Viát.Hospedaje Serv/Cliente, Merca y Ventas|D|D|5
610113|IMPUESTOS Y CONTRIBUCIONES VENTAS|D|P|4
61011301|Impuestos y Contribuciones Ventas|D|D|5
610114|COMISIONES DE OPERADORES|D|P|4
61011401|Comisión Pidacheque|D|D|5
61011402|Comisión POS VISA|D|D|5
61011403|Comisión POS Credomátic|D|D|5
610197|GASTOS DE VENTA GENERALES|D|P|4
61019701|Gastos de Venta Generales|D|D|5
610198|GASTOS DE VENTA NO DEDUCIBLES|D|P|4
61019801|GND de Venta|D|D|5
61019802|GND Publicidad y Promoción|D|D|5
62|GASTOS DE ADMINISTRACIÓN|D|P|2
6201|GASTOS DE ADMINISTRACIÓN|D|P|3
620101|SUELDOS DEL PERSONAL ADMINISTRATIVO|D|P|4
62010101|Sueldos del Personal Administrativo|D|D|5
620102|BONIF. INC. PERSONAL ADMINISTRATIVO|D|P|4
62010201|Bonif. Incentivo del Personal Administrativo|D|D|5
620103|HRS. EXT. PERSONAL ADMINISTRATIVO|D|P|4
62010301|Horas Extras del Personal Administrativo|D|D|5
620104|BONIF. DTO COMPLEMENTO ADMINISTRATIVOS|D|P|4
62010401|Bonif. 78.89 y 37-2001 Complemento Administrativos|D|D|5
620105|OTRAS BONIF. PERSONAL ADMIN.|D|P|4
62010501|Otras Bonificaciones Personal Administrativo|D|D|5
620106|PRESTACIONES PERSONAL ADMIN.|D|P|4
62010601|Bonos 14 del Personal Administrativo|D|D|5
62010602|Aguinaldos del Personal Administrativo|D|D|5
62010603|Vacaciones del Personal Administrativo|D|D|5
62010604|Indemnizaciones del Personal Administrativo|D|D|5
62010605|Cuota Patronal del Personal Administrativo|D|D|5
620107|HONORARIOS DE ADMINISTRACIÓN|A|P|4
62010701|Honorarios de Administración|D|D|5
62010702|Honorarios de Gerencia|D|D|5
62010703|Honorarios Eventuales|D|D|5
620108|AGUA POTABLE DE ADMINISTRACIÓN|D|P|4
62010801|Agua Potable de Administración|D|D|5
620109|ENERGÍA ELÉCTRICA ADMINISTRACIÓN|D|P|4
62010901|Energía Eléctrica de Administración|D|D|5
620110|TELEFONÍA FIJA DE ADMINISTRACIÓN|D|P|4
62011001|Teléfono 2251-1606 (Z1)|D|D|5
62011002|Teléfono 2238-2813 (Z1)|D|D|5
62011003|Teléfono 2470-8443 (OF. L3 SX / TEL-INTERNET)|D|D|5
62011004|Teléfono 2269-9800 (E1 / PBX)|D|D|5
620111|TELEFONÍA MÓVIL DE ADMINISTRACIÓN|D|P|4
62011101|Telefonía Móvil de Administración|D|D|5
620112|VIÁTICOS DE ADMINISTRACION|D|P|4
62011201|Viáticos por Alimentación de Administración|D|D|5
62011202|Viáticos por Transporte de Administración|D|D|5
62011203|Viáticos por Hospedaje de Administración|D|D|5
62011204|Viáticos Varios de Administración|D|D|5
62011205|Viáticos del Exterior|D|D|5
62011206|Combustibles Administración|D|D|5
620113|GTOS. REPRESENTACIÓN ADMIN.|D|P|4
62011301|Gastos de Representación de Administración|D|D|5
620114|CAPACITACIONES|D|P|4
62011401|Capacitaciones|D|D|5
620115|GASTOS DE RECLUTAMIENTO|D|P|4
62011501|Gastos De Reclutamiento|D|D|5
620116|ATENCIÓN AL PERSONAL|D|P|4
62011601|Atención al Personal|D|D|5
620117|ENVÍOS, CORREOS Y COURIER|D|P|4
62011701|Fletes, Envíos, Mensajería, Correos y Courier|D|D|5
620118|ALQUILERES DE ADMINISTRACIÓN|D|P|4
62011801|Alquiler de Oficina|D|D|5
62011802|Alquiler de Apartamento / Bodega|D|D|5
62011803|Alquiler de Mobiliario Y Equipo|D|D|5
62011804|Web Hosting|D|D|5
62011805|Dominio Grupodent.com|D|D|5
62011806|Arrendamiento Cloud Server|D|D|5
62011899|Devol. y Rebajas Sobre Alquileres Administrativos|D|D|5
620119|PAPELERÍA Y ÚTILES DE OFICINA|D|P|4
62011901|Papelería y Útiles de Oficina|D|D|5
620120|MANTENIMIENTO Y REPARACIONES OF|D|P|4
62012001|Mantenimiento y Reparaciones Generales|D|D|5
62012002|Mantto. y Reparaciones Equipo de Computación|D|D|5
62012003|Cuota de Mantenimiento Local Oficina|D|D|5
62012098|Dev y Reb Sobre Mantto y Reparaciones Oficina|D|D|5
620121|MAT. Y ÚTILES DE LIMPIEZA OFICINA|D|P|4
62012101|Materiales y Útiles de Limpieza de Oficina|D|D|5
620122|CUOTAS Y SUSCRIPCIONES DE OFICINA|D|P|4
62012201|Cuotas y Suscripciones de Oficina|D|D|5
620123|UNIFORMES|D|P|4
62012301|Uniformes|D|D|5
620124|IMPUESTOS Y CONTRIBUCIONES ADMIN|D|P|4
62012401|Impuestos y Contribuciones Administración|D|D|5
620125|REMOD. Y MANTTO. DE INSTALACIONES|D|P|4
62012501|Mantto. y Remodelación de Instalaciones|D|D|5
620126|DEPRECIA. Y AMORTIZACIONES OFICINA|D|P|4
62012601|Dep. y Amortiz. Mobiliario y Equipo de Oficina|D|D|5
62012602|Dep. y Amortiz. Equipo Computación|D|D|5
62012603|Depreciaciones de Vehículos|D|D|5
62012604|Amortizaciones Gastos de Organización|D|D|5
62012605|Amortizaciones Gastos de Instalación|D|D|5
62012606|Amortizaciones Software Propio|D|D|5
62012607|Amortizaciones Licencias de Software|D|D|5
620127|SEGUROS Y FIANZAS|D|P|4
62012701|Seguros de Vehículos|D|D|5
62012702|Seguros sobre Préstamos|D|D|5
620128|CONSULTORÍAS|D|P|4
62012801|Auditorías|D|D|5
62012802|Consultorías Administrativas|D|D|5
62012803|Consultorías Legales|D|D|5
62012804|Consultorías de Sistemas Informáticos|D|D|5
620129|GASTO MOB. Y EQUIPO OFICINA|D|P|4
62012901|Mobiliario y Equipo Oficina Gasto|D|D|5
620130|PARQUEO PARA PERSONAL ADMINISTRATIVO|D|P|4
62013001|Parqueo Personal Administrativo / Comercialización|D|D|5
620131|SUELDOS Y DIETAS DE SOCIOS|D|P|4
62013101|Sueldos Pagados a Socios|D|D|5
62013102|Dietas Pagadas a Socios|D|D|5
620197|GASTOS ADMINISTRATIVOS GENERALES|D|P|4
62019701|Gastos Administrativos Generales|D|D|5
62019702|Servicios Administrativos Varios Recibidos|D|D|5
620198|GTOS. ADMIN. NO DEDUCIBLES|D|P|4
62019801|GND Administrativos|D|D|5
62019802|GND por Redondeo Pago de IVA|D|D|5
62019803|GND Servicios Administrativos recibidos|D|D|5
62019804|GND Fletes, Envíos y mensajería|D|D|5
62019805|GND de Reclutamiento|D|D|5
62019806|GND Mantto. Y Reparaciones Admon|D|D|5
62019807|GND Transporte Admin|D|D|5
62019808|GND Viáticos Varios Personal Admon|D|D|5
62019809|GND de Atención al Personal|D|D|5
7|OTROS INGRESOS|A|P|1
71|OTROS INGRESOS|A|P|2
7101|OTROS INGRESOS|A|P|3
710101|OTROS INGRESOS|A|P|4
71010101|Intereses Ganados|A|D|5
71010102|Otros Ingresos|A|D|5
71010103|Servicios Administrativos|A|D|5
71010104|Diferencial Cambiario Ingreso|A|D|5
71010105|Apoyo Proyecto Internacionalización de servicios|A|D|5
8|OTROS GASTOS|D|P|1
81|OTROS GASTOS|D|P|2
8101|OTROS GASTOS|D|P|3
810101|OTROS GASTOS FINANCIEROS|D|P|4
81010101|Intereses Pagados|D|D|5
81010102|Gastos Bancarios|D|D|5
81010103|Otros Gastos Financieros|D|D|5
81010104|Diferencial Cambiario Gasto|D|D|5
81010105|Impuesto sobre Productos Financieros - IPF|D|D|5
810102|OTROS GASTOS|D|P|4
81010201|Regalías|D|D|5
8102|OTROS GASTOS POR PROYECTOS|D|P|3
810201|PROYECTO INTERNACIONALIZACIÓN|D|P|4
81020101|Proyecto Asesoría|D|D|5
81020102|Proyecto Rediseño Sitio Web|D|D|5
81020103|Proyecto Software a la Medida|D|D|5`;

    const nomenclaturaData = rawNomenclatura.split('\n').map(line => {
        const parts = line.split('|');
        return { codigo: parts[0], descripcion: parts[1], da: parts[2], pd: parts[3], nivel: parts[4] };
    });

    const renderNomenclatura = () => {
        const tbody = document.querySelector('#tabla-nomenclatura tbody');
        const datalist = document.getElementById('cuentas-list');
        tbody.innerHTML = ''; datalist.innerHTML = '';
        nomenclaturaData.forEach(cuenta => {
            const padding = (parseInt(cuenta.nivel) - 1) * 15;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${cuenta.codigo}</strong></td><td style="padding-left: ${padding + 5}px;">${cuenta.descripcion}</td><td>${cuenta.da}</td><td>${cuenta.pd}</td><td>${cuenta.nivel}</td>`;
            tbody.appendChild(tr);
            const opt = document.createElement('option');
            opt.value = `${cuenta.codigo} - ${cuenta.descripcion}`;
            datalist.appendChild(opt);
        });
    };

    // PARTIDAS LOGIC
    const tbodyPartida = document.getElementById('filas-partida');
    const totalDebeEl = document.getElementById('total-debe');
    const totalHaberEl = document.getElementById('total-haber');

    const createRow = () => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><input type="text" placeholder="Buscar cuenta..." class="input-cuenta" list="cuentas-list"></td><td><input type="number" step="0.01" class="input-debe" placeholder="0.00"></td><td><input type="number" step="0.01" class="input-haber" placeholder="0.00"></td><td style="text-align: center;"><button class="btn-danger btn-remove-row">X</button></td>`;
        tr.querySelector('.input-debe').addEventListener('input', calculateTotals);
        tr.querySelector('.input-haber').addEventListener('input', calculateTotals);
        tr.querySelector('.btn-remove-row').addEventListener('click', () => { tr.remove(); calculateTotals(); });
        tbodyPartida.appendChild(tr);
    };

    const calculateTotals = () => {
        let debe = 0, haber = 0;
        document.querySelectorAll('.input-debe').forEach(inp => debe += Number(inp.value) || 0);
        document.querySelectorAll('.input-haber').forEach(inp => haber += Number(inp.value) || 0);
        debe = Math.round(debe * 100) / 100; haber = Math.round(haber * 100) / 100;
        totalDebeEl.textContent = `Q ${debe.toFixed(2)}`; totalHaberEl.textContent = `Q ${haber.toFixed(2)}`;
        const color = (debe === haber && debe > 0) ? 'green' : 'red';
        totalDebeEl.style.color = color; totalHaberEl.style.color = color;
    };

    document.getElementById('btn-add-row').addEventListener('click', createRow);

    document.getElementById('btn-save-partida').addEventListener('click', () => {
        const fecha = document.getElementById('fecha-partida').value;
        const desc = document.getElementById('desc-partida').value;
        if (!fecha || !desc) { alert('Ingrese fecha y comentarios.'); return; }
        let dTotal = 0, hTotal = 0; const detalle = [];
        document.querySelectorAll('#filas-partida tr').forEach(fila => {
            const cta = fila.querySelector('.input-cuenta').value;
            const deb = parseFloat(fila.querySelector('.input-debe').value) || 0;
            const hab = parseFloat(fila.querySelector('.input-haber').value) || 0;
            if (cta || deb > 0 || hab > 0) { detalle.push({ cta, deb, hab }); dTotal += deb; hTotal += hab; }
        });
        dTotal = Math.round(dTotal * 100) / 100; hTotal = Math.round(hTotal * 100) / 100;
        if (detalle.length === 0 || dTotal !== hTotal || dTotal === 0) { alert('Asiento inválido o descuadrado.'); return; }
        const partidas = JSON.parse(localStorage.getItem('sisconta_partidas_grupodent')) || [];
        partidas.push({ id: Date.now(), fecha, desc, detalle, total: dTotal });
        localStorage.setItem('sisconta_partidas_grupodent', JSON.stringify(partidas));
        alert('Asiento guardado.');
        document.getElementById('fecha-partida').value = ''; document.getElementById('desc-partida').value = '';
        tbodyPartida.innerHTML = ''; createRow(); createRow(); calculateTotals(); actualizarDashboard();
    });

    // CONSULTA LOGIC
    const renderConsultaPartidas = (filtro = '') => {
        const tbody = document.getElementById('filas-consulta-partidas');
        tbody.innerHTML = '';
        const partidas = JSON.parse(localStorage.getItem('sisconta_partidas_grupodent')) || [];
        partidas.filter(p => p.desc.toLowerCase().includes(filtro.toLowerCase()) || p.fecha.includes(filtro))
               .reverse().forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.id}</td><td>${p.fecha}</td><td>${p.desc}</td><td>Q ${parseFloat(p.total).toFixed(2)}</td><td style="text-align: center;"><button class="sap-btn" onclick="verDetallePartida(${p.id})">Ver</button></td>`;
            tbody.appendChild(tr);
        });
    };
    document.getElementById('search-partidas').addEventListener('input', (e) => renderConsultaPartidas(e.target.value));
    window.verDetallePartida = (id) => {
        const p = (JSON.parse(localStorage.getItem('sisconta_partidas_grupodent')) || []).find(x => x.id === id);
        if(p) alert(`Asiento: ${p.desc}\nTotal: Q${p.total.toFixed(2)}`); // Simplificado para brevedad
    };

    // CIERRES LOGIC
    const inEfectivo = document.getElementById('cierre-efectivo');
    const inTransfers = document.getElementById('cierre-transferencias');
    const inTotal = document.getElementById('cierre-total');
    const calcCierre = () => { inTotal.value = `Q ${( (parseFloat(inEfectivo.value) || 0) + (parseFloat(inTransfers.value) || 0) ).toFixed(2)}`; };
    inEfectivo.addEventListener('input', calcCierre); inTransfers.addEventListener('input', calcCierre);

    const actualizarDashboard = () => {
        const partidas = JSON.parse(localStorage.getItem('sisconta_partidas_grupodent')) || [];
        const cont = document.getElementById('dash-asientos'); if(cont) cont.textContent = partidas.length;
    };
});