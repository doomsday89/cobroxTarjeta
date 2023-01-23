    Vue.createApp({
        components:{
            Estadocuenta:EstadocuentaComponent,
            Prediodetalle:DetalleComponent
        },
        data() {
          return {    
            //urlServer :"http://catastro.chiapas.gob.mx/Municipios/api/Cobro",
            urlServer:"http://localhost:5289/api/Cobro",
            token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2wiOiIyIiwiVXN1YXJpb0xvZ2luIjoic2NsYy1vbmxpbmUiLCJNdW5pY2lwaW9DbGF2ZSI6IjA3OCIsIm5iZiI6MTY3Mjc3MTE1MiwiZXhwIjoxNjc1MTkwMzUxLCJpYXQiOjE2NzI3NzExNTJ9.iGc8fajH-eQH14XHpe0AasXYX6dhNdwAK69boeq7MXc",
            Clave:{
                Clasificacion:"0",
                Municipio:'078',
                Localidad:"0001",
                Clave8:"",
                ClaveCatastral:"00780001"
            }, 
            Localidades:[{Clave:'0001',Nombre:'San cris'}],
            Clasificaciones:[
                    {Clave:'0',Nombre:'Urbano'},
                    {Clave:'1',Nombre:'Rustico'},
                    {Clave:'2',Nombre:'Sin estudio'},
            ],
            IsDiferencia:false, 
            loading:false,
            showalert:false,
            dataDetails:{},
            dataCobros:[],
            msgAlert:'',
            TipoColindancias:[
              {"Clave":"1","Nombre":"Uno"},
              {"Clave":"2","Nombre":"Dos"},
              {"Clave":"3","Nombre":"Tres"}          
            ],
          }
        },
        methods:{
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
                    this.Clave.ClaveCatastral= this.Clave.Clasificacion + this.Clave.Municipio + this.Clave.Localidad + this.Clave.Clave8;
                else //rustica
                    this.Clave.ClaveCatastral= this.Clave.Clasificacion + this.Clave.Municipio + this.Clave.Localidad + ' '+ this.Clave.Clave8;
                
                
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
                fetch(this.urlServer + "/DetallePredio/" +this.Clave.ClaveCatastral, requestOptions)
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
                //$scope.isLoading = true;            
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
                fetch(this.urlServer + "/CalcularImpuesto", requestOptions)
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
        
    })    
    .mount('#app')