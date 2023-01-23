let EstadocuentaComponent ={
    props:["cobros","asdiferencia"],
    computed:{
        CalcularTotal(){
            return this.cobros.reduce((accumalator, item)=> {return accumalator+item.total},0);
        }
    },
    template: `
    <div class="card" v-if="cobros.length>0" v-cloak>
        <h3 class="card-header">Cobros 
            <span class="badge badge-pill badge-warning" v-if="asdiferencia">(diferencia)</span>
        </h3>
        <div class="card-body">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                    <td>Ejercicio</td>
                    <td>Gasto de Ejecucion</td>
                    <td>Actualización</td>
                    <td>Descuento</td>
                    <td>Impuesto</td>
                    <td>Multa</td>
                    <td>Recargo</td>
                    <td>Total</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cobros">
                        <td>{{item.ejercicio}}<span class="glyphicon glyphicon-remove btn ng-hide"
                            aria-hidden="true" title="Quita cobro más reciente" @click="QuitarCobro()"
                            v-if="cobros[cobros.length-1].Ejercicio==item.Ejercicio"></span></td>
                    <td>{{item.gastoEjecucion}}</td>
                    <td>{{item.actualizacion}}</td>
                    <td>{{item.descuento}}</td>
                    <td>{{item.impuesto}}</td>
                    <td>{{item.multa}}</td>
                    <td>{{item.recargo}}</td>
                    <td>$ {{item.total}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="form-inline breadcrumb float-right">
                
                <button type="button" class="btn btn-success btn-lg" @click="GuardarCobro()"
                    title="Pagar total">Pagar $ {{CalcularTotal}}</button>
            </div>
        </div>
    </div>
    `,
    
};