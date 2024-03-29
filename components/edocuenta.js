let EstadocuentaComponent ={    
    props:["clavecatastral","asdiferencia"],
    data(){
        return{            
            amount:19,
            ref:'',
            Signature:'',
            idexpress:IdExpress,
            urlretorno:urlreturn,
            dataCobros: [],
            pagando:false
        }
    },
    methods: {
        preSave() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json; charset=utf-8");  
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ Referencia: this.ref }),
                redirect:'follow'
            };
            this.pagando = true;            
            this.showalert = false;
            fetch("../confirm.aspx/PreSave", requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.pagando = false;
                    if (result.d>0) {
                        console.log('ok, redirecting...');
                        this.$refs.formBank.submit();
                    }
                    else {
                        console.log('only redirecting!');
                    }
                })
                .catch(err => { this.pagando = false; this.showalert = true; this.msgAlert = err; });
        },
        GetEstadoCuenta(clavecatastral){         
            this.dataCobros=[];
            
            const bodyParams = JSON.stringify({ 
                ClaveCatastral: clavecatastral,
                CantidadEjercicios:5,
                IsPensionado:false,
                IsEspontaneo: false,
                IsCondonacion:false
            });
            const myHeaders = new Headers();
            myHeaders.append("Authorization", token);
            myHeaders.append("Content-Type","application/json; charset=utf-8");            

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body:bodyParams,
                redirect: 'follow'
                };
            this.loading=true;
            this.showalert=false; 
            fetch(urlAPI + "Cobro/CalcularMultipago", requestOptions)
            .then(response => response.json())
            .then(result => {
                this.loading=false;
                if(result.ok){                    
                    this.dataCobros=result.data.calculo;
                    this.Signature = result.data.signature; 
                    this.ref = this.dataCobros[0].claveCatastral.replace(' ','R')
                }
                else{
                    this.msgAlert=result.message;
                    this.showalert=true;
                }                    
            })
            .catch(err=>{this.loading=false;this.showalert=true;this.msgAlert=err;});
        },
         
    },
    computed:{
        CalcularTotal(){
            if(this.dataCobros.length>0)
                this.amount=this.dataCobros.reduce((accumalator, item)=>  accumalator+item.total,0);
                this.amount= this.amount.toFixed(2);
                return this.amount;
        }
    },
    watch:{
        clavecatastral: function (value, oldValue) {            
            this.GetEstadoCuenta(value);
        }
        
    },
    template: '#edocuenta-template'    
};