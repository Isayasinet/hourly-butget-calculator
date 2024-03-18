//Calculo de ingresos netos mensuales y anuales
let netoMensualInput = document.getElementById("ingresos-mensuales");
let ingresoMensualSpan = document.getElementById("ingresos-mensuales-span");
let ingresoAnualSpan = document.getElementById("ingreso-anual-span");

let ingresosMensuales = 0;
let ingresosAnuales = 0;
//calculo de costos de IPF por tramos
let tramo1por = 0.19;
let tramo2por = 0.24;
let tramo3por = 0.3;
let tramo4por = 0.37;
let tramo5por = 0.45;
let tramo1 = 12450;
let tramo2 = 20200;
let tramo3 = 35200;
let tramo4 = 60000;
let tramo5 = 300000;
let tramo1aplicado = 0;
let tramo2aplicado = 0;
let tramo3aplicado = 0;
let tramo4aplicado = 0;
let tramo5aplicado = 0;

// Mejora: Simplificación de la lógica de cálculo de ingresos anuales y aplicación de tramos IRPF
document.addEventListener('DOMContentLoaded', () => {
    netoMensualInput.addEventListener('input', () => {
        clearTimeout(window.timerCalculoIngresos); // Cancela el temporizador anterior si existe
        window.timerCalculoIngresos = setTimeout(() => {
            let ingresosMensuales = parseFloat(netoMensualInput.value) || 0;
            let ingresosAnuales = ingresosMensuales * 12;
            ingresoMensualSpan.textContent = ingresosMensuales.toFixed(2);
            ingresoAnualSpan.textContent = ingresosAnuales.toFixed(2);
            calcularIRPF(ingresosAnuales);
        }, 500); // Reduce el tiempo de espera a 0.5 segundos para mejorar la respuesta
    });
});

function calcularIRPF(ingresosAnuales) {
    let tramos = [
        { limite: 12450, porcentaje: 0.19 },
        { limite: 20200, porcentaje: 0.24 },
        { limite: 35200, porcentaje: 0.3 },
        { limite: 60000, porcentaje: 0.37 },
        { limite: 300000, porcentaje: 0.45 }
    ];
    let irpfTotal = 0;
    let contenidoHTML = '';
    tramos.forEach((tramo, index) => {
        let limiteInferior = index === 0 ? 0 : tramos[index - 1].limite;
        let aplicable = calcularTramoAplicado(ingresosAnuales, limiteInferior, tramo.limite, tramo.porcentaje);
        if (aplicable > 0) {
            contenidoHTML += `<li>Tramo ${index + 1}: ${aplicable.toFixed(2)}</li>`;
            irpfTotal += aplicable;
        }
    });
    document.getElementById("costos-IRPF").innerHTML = `${contenidoHTML} 
    <p>IRPF total: <b>${irpfTotal.toFixed(2)} €</b></p>`;
}


function calcularTramoAplicado(ingreso, tramoInferior, tramoSuperior, porcentaje) {
    if (ingreso > tramoInferior) {
        let aplicable = Math.min(ingreso, tramoSuperior) - tramoInferior;
        return aplicable * porcentaje;
    }
    return 0;
}

// Cálculo de IVA mejorado
document.getElementById("costos-iva").addEventListener('change', calcularIVA);
netoMensualInput.addEventListener('input', calcularIVA);

function calcularIVA() {
    let porcentajeIVA = document.getElementById("costos-iva").value;
    let ingresosAnuales = parseFloat(netoMensualInput.value) * 12 || 0;
    let ivaCalculado = ingresosAnuales * (parseFloat(porcentajeIVA) / 100);
    document.getElementById("costos-iva-span").textContent = ivaCalculado.toFixed(2);
}



// Cálculo de horas, días, semanas, meses, vacaciones, festivos, etc.
document.addEventListener('DOMContentLoaded', () => {
    let timer; // Variable para almacenar el temporizador

    document.getElementById('dias-horas').addEventListener('input', () => {
        clearTimeout(timer); // Cancela el temporizador anterior
        timer = setTimeout(() => {
            const diasSemana = parseInt(document.getElementById('dias-semana').value) || 0;
            const horasDia = parseInt(document.getElementById('horas-dia').value) || 0;
            const horasSemanaInput = parseInt(document.getElementById('horas-semana').value) || 0;
            let horasSemana, horasDiaCalculadas;

            if (horasDia > 0 && diasSemana > 0) {
                // Calculo de horas a la semana basado en horas por día y días a la semana
                horasSemana = horasDia * diasSemana;
                document.getElementById('horas-semana').value = horasSemana.toFixed(2);
            } else if (horasSemanaInput > 0 && diasSemana > 0) {
                // Calculo de horas al día basado en horas a la semana y días a la semana
                horasDiaCalculadas = horasSemanaInput / diasSemana;
                document.getElementById('horas-dia').value = horasDiaCalculadas.toFixed(2);
            };
            let diasLibresSemana = 7 - diasSemana;
            document.getElementById('dias-libres-semana-span').textContent = diasLibresSemana;
            const diasVacaciones = parseInt(document.getElementById('dias-vacaciones').value);
            let diasDescanso = ((365 - diasVacaciones)/7) * diasLibresSemana;
            document.getElementById('dias-descanso-ano-span').textContent = diasDescanso.toFixed();
            const diasFestivos = parseInt(document.getElementById('dias-festivos').value);
            let diasLaborales = (365 - diasVacaciones - diasDescanso - diasFestivos)
            document.getElementById('dias-trabajo-span').textContent = diasLaborales.toFixed();
            let diasLibresAno = diasDescanso + diasFestivos + diasVacaciones
            document.getElementById("dias-libres-anio-span").textContent = diasLibresAno.toFixed();

        }, 1000); // Establece el temporizador a 1 segundo
    });
});
//horas laborales y extras
document.addEventListener('DOMContentLoaded', () => {
    let timer;
    document.getElementById('dias-horas').addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const horasSemanaInput = parseInt(document.getElementById('horas-semana').value) || 0;
            let horasLaborales = horasSemanaInput <= 40 ? horasSemanaInput : 40;
            document.getElementById('horas-semana-span').textContent = horasLaborales;
            let horasExtras = horasSemanaInput > 40 ? horasSemanaInput - 40 : 0;
            document.getElementById('horas-extras-semana-span').textContent = horasExtras;
        }, 1000);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ingresos-netos').addEventListener('input', () => {
        let ingresosMensuales = parseFloat(document.getElementById('ingresos-mensuales').value) || 0;
        let porcentajeIVA = parseFloat(document.getElementById('costos-iva').value) / 100;
        let ingresosAnuales = ingresosMensuales * 12;
        let ivaAnual = ingresosAnuales * porcentajeIVA;
        // Cálculo de IRPF total basado en los tramos aplicados
        let irpfTotal = tramo1aplicado + tramo2aplicado + tramo3aplicado + tramo4aplicado + tramo5aplicado;
        let ingresosBrutos = ingresosAnuales + ivaAnual + irpfTotal; // Se suma el IRPF al cálculo de ingresos brutos
        let ingresosBrutosMinimos = ingresosBrutos * 1.15; // Se aplica un 15% de margen para gastos e imprevistos
        document.getElementById('ingresos-brutos-minimos-span').textContent = ingresosBrutosMinimos.toFixed(2);
    });
});

