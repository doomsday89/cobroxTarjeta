    Vue.createApp({
        components:{
            Estadocuenta:EstadocuentaComponent,
            Prediodetalle:DetalleComponent
        },
        data() {
          return {    
            
            Clave:{
                Clasificacion:"0",
                Localidad:"0001",
                Clave8:"",
                ClaveCatastral:""
            }, 
            Localidades:[],
            Clasificaciones:[
                    {clave:'0',nombre:'Urbano (8 digitos)'},
                    {clave:'1',nombre:'Rustico (max 7 digs)'},
                    {clave:'2',nombre:'Sin estudio (max 7 digs)'},
            ],
            IsDiferencia:false,
            loading: false,
            showalert:false,
            showhelp:false,
            dataDetails:{},
            msgAlert:'',
          }
        },
        methods: {
            GetLocalidades() {
                this.Localidades=[];
                var myHeaders = new Headers();
                myHeaders.append("Authorization", token);
                myHeaders.append("Content-Type","application/json; charset=utf-8");
    
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders
                    };
                this.loading=true;    
                this.showalert=false;
                fetch(urlAPI + "Catalogo/GetLocalidades/" + MunicipioClave+'/'+Usuario, requestOptions)
                .then(response => {
                    if(response.ok)
                        return response.json();
                    else{
                        return response;
                    }
                })
                .then(result => {
                    this.loading=false;
                    if(!result.ok){
                        this.msgAlert=`${result.status}:${result.statusText}`;
                        this.showalert=true;
                        return;
                    }
                    if(result.ok){ 
                        this.Localidades=JSON.parse(JSON.stringify(result.data));
                    }
                    else{
                        this.msgAlert=result.message;
                        this.showalert=true;
                    }
                })
                .catch(err=>{
                    this.loading=false;this.showalert=true;this.msgAlert=err;
                });
            },
            GetDetallePredio() {
                
                this.dataDetails={};
                this.Clave.ClaveCatastral='';
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
                    this.Clave.ClaveCatastral= this.Clave.Clasificacion + MunicipioClave + this.Clave.Localidad + this.Clave.Clave8;
                else //rustica
                    this.Clave.ClaveCatastral= this.Clave.Clasificacion + MunicipioClave + this.Clave.Localidad + ' '+ this.Clave.Clave8;
                
                
                var myHeaders = new Headers();
                myHeaders.append("Authorization", token);
                myHeaders.append("Content-Type","application/json; charset=utf-8");
                myHeaders.append("Access-Control-Allow-Origin","*");
    
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders
                    };
                this.loading=true;    
                this.showalert=false;
                fetch(urlAPI + "Cobro/DetallePredio/" +this.Clave.ClaveCatastral+'/'+Usuario, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.loading=false;
                    if(result.ok){ 
                        this.dataDetails=JSON.parse(JSON.stringify(result.data[0]));
                        this.IsDiferencia=this.dataDetails.ultimoPeriodoPago == new Date().getFullYear() ? true : false;
                    }
                    else{
                        this.msgAlert=result.message;
                        this.showalert=true;
                    }
                })
                .catch(err=>{this.loading=false;this.showalert=true;this.msgAlert=err;});
            }            
        },
        mounted(){this.GetLocalidades()}
    })    
    .mount('#app')