let EstadocuentaComponent ={    
    props:["clavecatastral","asdiferencia"],
    data(){
        return{
            urlAPI:"http://localhost:5289/api/",
            token:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJSb2wiOiIyIiwiVXN1YXJpb0xvZ2luIjoibXVsdGlwYWdvcy0wNTkiLCJNdW5pY2lwaW9DbGF2ZSI6IjA1OSIsIm5iZiI6MTY4MDI4NDQwOCwiZXhwIjoxNjgwMzcwODA4LCJpYXQiOjE2ODAyODQ0MDh9.ZcmPKsWy13OylJgg_tYq4tbOe17KLoRks55rfh8x4Bk",
            MunicipioId:'059',
            amount:19,
            ref:'',
            Signature:'',
            idexpress:'3095',
            dataCobros:[]
        }
    },
    methods:{
        GetEstadoCuenta(clavecatastral){         
            this.dataCobros=[];
            
            const bodyParams = JSON.stringify({ 
                ClaveCatastral: clavecatastral,
                CantidadEjercicios:5,
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
            fetch(this.urlAPI + "Cobro/CalcularMultipago", requestOptions)
            .then(response => response.json())
            .then(result => {
                this.loading=false;
                if(result.ok){                    
                    this.dataCobros=result.data.calculo;
                    this.Signature = result.data.signature; 
                    this.ref = this.clavecatastral.replace(' ','R')
                }
                else{
                    this.msgAlert=result.message;
                    this.showalert;
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