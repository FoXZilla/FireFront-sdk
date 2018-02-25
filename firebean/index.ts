import {FireBean as FireBeanTypes} from '@foxzilla/fireblog';


class FireBean{
    public _debug =false;
    public data?:FireBeanTypes.Data;
    debug(val=true){
        this._debug=val;
        return this;
    };
    log(...msg:any[]){
        if(!this._debug)return;
        if(window.opener)window.opener.console.log('From Child:',...msg);
        console.log(...msg);
    };
    parse(url:string){
        this.log(`parse ${url}`);
        if(FireBean.checkUrl(url)){
            this.data =FireBean.parseData(url);
            this.log(`parsed ${this.data._type}`);
        }else{
            this.log('parse fail');
        };
        return this;
    }
    getData(){
        return this.data;
    }
    exec(data=this.data){
        if(data){
            if(data._type in FireBean.Actions){
                FireBean.Actions[data._type](data);
                this.log(`exec #${data._type}`);
            }else{
                this.log(`not found type "${data._type}"`);
            }
        }else{
            this.log('no data, ignore exec');
        };
        return this;
    };
    redirect(data=this.data){
        if(data){
            let redirectUrl =data._redirect||'/';
            if(data._close==='1'){
                this.log(`try close`);
                window.close();
                setTimeout(()=>{
                    this.log(`close timeout, redirect ${redirectUrl}`);
                    window.open(redirectUrl,'_self');
                });
            }else{
                this.log(`redirect #${redirectUrl}`);
                window.open(redirectUrl,'_self');
            };
        }else{
            this.log('no data, ignore redirect');
        };
        return this;
    };
    run(debug=false){
        return this.debug(debug).parse(location.href).exec().redirect();
    };
    static Actions:{[p in FireBeanTypes.Type]:(data:any)=>void} ={
        set_storage(data:FireBeanTypes.SetStorageData){
            localStorage.setItem(data.key,data.value);
        },
        remove_storage(data:FireBeanTypes.RemoveStorageData){
            localStorage.removeItem(data.key);
        },
    };
    static parseData(url:string):FireBeanTypes.Data{
        var data:any ={};
        for(let item of url.split('?').pop()!.split('&')){
            let [key,value] =item.split('=');
            data[decodeURIComponent(key)] =decodeURIComponent(value);
        };
        return data;
    };
    static checkUrl(url:string):boolean{
        return url.split('/').pop()!.split('?').shift()==='_firebean'
            || url.split('/').pop()!.split('?').pop()!.indexOf('_firebean=1')!==-1
        ;
    };
};


if(typeof module!=='undefined') module.exports =FireBean;
