let DetalleComponent=
    {
        props:["predio"],
        data(){
            return{
                toggle:true
            }
        },
        template:`
        <div v-if="JSON.stringify(predio) !== '{}'">
        <fieldset>
            <legend>
                <a href="#" @click="toggle=!toggle" class="dropdown-toggle">Datos generales</a>
            </legend>
            <div v-if="toggle"  class="animated">
                <div class="row">
                    <label class="col-form-label col-md-2">Clave</label>
                    <div class="col-md-3">
                        <label class="form-control">{{predio.claveCatastral}}</label>
                    </div>
                </div>
                <div class="row">
                    <label class="col-form-label col-md-2">Propietario</label>
                    <div class="col-md-6">
                        <label class="form-control">{{predio.nombrePropietario}}</label>
                    </div>
                </div>
                <div class="row">
                    <label class="col-form-label col-md-2">Ubicacion</label>
                    <div class="col-md-6">
                        <label class="form-control">{{predio.ubicacionPredio}}</label>
                    </div>
                </div>

                <div class="row" v-if="predio.IsRustico">
                    <label class="col-form-label col-md-2">Nombre Predio</label>
                    <div class="col-md-6">
                        <label class="form-control">{{predio.nombrePredio}}</label>
                    </div>
                </div>
                <div class="row">
                    <label class="col-form-label col-md-2">Area</label>
                    <div class="col-md-3">
                        <label class="form-control">{{predio.area }}</label>
                    </div>
                </div>
                <div class="row">
                    <label class="col-form-label col-md-2">Valor Fiscal</label>
                    <div class="col-md-3">
                        <label class="form-control">{{predio.valorCatastral}}</label>
                    </div>
                </div>
                <div class="row">
                    <label class="col-form-label col-md-2">UltimoPeriodoPago</label>
                    <div class="col-md-3">
                        <label class="form-control">{{predio.ultimoPeriodoPago}}</label>
                    </div>
                </div>
            </div>
        </fieldset>
        </div>
        `  
    };