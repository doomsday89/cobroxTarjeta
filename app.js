    Vue.createApp({
        components:{
            Estadocuenta:EstadocuentaComponent,
            Prediodetalle:DetalleComponent
        },
        data() {
          return {    
            //urlAPI :"http://catastro.chiapas.gob.mx/Municipios/api/",
            urlAPI:"http://localhost:5289/api/",
            token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2wiOiIyIiwiVXN1YXJpb0xvZ2luIjoic2NsYy1vbmxpbmUiLCJNdW5pY2lwaW9DbGF2ZSI6IjA3OCIsIm5iZiI6MTY3Mjc3MTE1MiwiZXhwIjoxNjc1MTkwMzUxLCJpYXQiOjE2NzI3NzExNTJ9.iGc8fajH-eQH14XHpe0AasXYX6dhNdwAK69boeq7MXc",
            MunicipioClave:'078',
            Usuario:'sclc-online',
            
            Clave:{
                Clasificacion:"0",
                Localidad:"0001",
                Clave8:"",
                ClaveCatastral:"00780001"
            }, 
            Localidades:[],
            Clasificaciones:[
                    {clave:'0',nombre:'Urbano'},
                    {clave:'1',nombre:'Rustico'},
                    {clave:'2',nombre:'Sin estudio'},
            ],
            IsDiferencia:false, 
            loading:false,
            showalert:false,
            dataDetails:{},
            dataCobros:[],
            msgAlert:'',
          }
        },
        methods:{
            GetLocalidades() {
                this.Localidades=[];
                var myHeaders = new Headers();
                myHeaders.append("Authorization", this.token);
                myHeaders.append("Content-Type","application/json; charset=utf-8");
    
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders
                    };
                this.loading=true;    
                this.showalert=false;
                console.log(this.urlAPI + "Catalogo/GetLocalidades/" +this.MunicipioClave+'/'+this.Usuario);
                fetch(this.urlAPI + "Catalogo/GetLocalidades/" +this.MunicipioClave+'/'+this.Usuario, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.loading=false;
                    if(result.ok){ 
                        this.Localidades=JSON.parse(JSON.stringify(result.data));
                        console.log(this.Localidades)
                    }
                    else{
                        this.msgAlert=result.message;
                        this.showalert=true;
                    }
                })
                .catch(err=>{this.loading=false;this.showalert=true;this.msgAlert=err;});
            },
            GetDetallePredio() {
                
                this.dataDetails={};
                this.dataCobros=[];
                //Valirdar
                if(this.Clave.Clave8.length=='')
                    {
                        this.msgAlert="Escriba una clave para buscar";
                        this.showalert=true;
                        return;
                    }
                if(this.Clave.Clasificacion=="0")
                    if(this.Clave.Clave8.length<8){
                        this.msgAlert="La clave urbana debe contener 8 digitos";
                        this.showalert=true;
                        return;
                    }
                if(this.Clave.Clasificacion=="0")
                    this.Clave.ClaveCatastral= this.Clave.Clasificacion + this.MunicipioClave + this.Clave.Localidad + this.Clave.Clave8;
                else //rustica
                    this.Clave.ClaveCatastral= this.Clave.Clasificacion + this.MunicipioClave + this.Clave.Localidad + ' '+ this.Clave.Clave8;
                
                
                var myHeaders = new Headers();
                myHeaders.append("Authorization", this.token);
                myHeaders.append("Content-Type","application/json; charset=utf-8");
                myHeaders.append("Access-Control-Allow-Origin","*");
    
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders
                    };
                this.loading=true;    
                this.showalert=false;
                fetch(this.urlAPI + "Cobro/DetallePredio/" +this.Clave.ClaveCatastral+'/'+this.Usuario, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.loading=false;
                    if(result.ok){ 
                        this.dataDetails=JSON.parse(JSON.stringify(result.data[0]));
                        this.GetEstadoCuenta(this.Clave.ClaveCatastral);
                    }
                    else{
                        this.msgAlert=result.message;
                        this.showalert=true;
                    }
                })
                .catch(err=>{this.loading=false;this.showalert=true;this.msgAlert=err;});
            },
            GetEstadoCuenta(clavecatastral){         
                let CantidadEjercicios = this.dataCobros.length;
                if(CantidadEjercicios==0)
                    CantidadEjercicios=5;
                
                const bodyParams = JSON.stringify({ 
                    ClaveCatastral: clavecatastral,
                    CantidadEjercicios:CantidadEjercicios,
                    Pensionado:false,
                    Espontaneo:false
                });
                const myHeaders = new Headers();
                myHeaders.append("Authorization", this.token);
                myHeaders.append("Content-Type","application/json; charset=utf-8");            
    
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body:bodyParams,
                    redirect: 'follow'
                    };
                this.loading=true;
                this.showalert=false; 
                fetch(this.urlAPI + "Cobro/CalcularImpuesto", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.loading=false;
                    if(result.ok){
                        this.IsDiferencia=this.dataDetails.ultimoPeriodoPago == new Date().getFullYear() ? true : false;
                        this.dataCobros=result.data; 
                    }
                    else{
                        this.msgAlert=result.message;
                        this.showalert;
                    }                    
                })
                .catch(err=>{this.loading=false;this.showalert=true;this.msgAlert=err;});
            }            
        },
        mounted(){this.GetLocalidades()}
    })    
    .mount('#app')