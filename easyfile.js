(e=>{
    window.EasyFile = new class{
        #initialized = false;
        #downloader;
        #uploader;
        #efeid = "efupdownloader";
        constructor() {
            document.addEventListener('DOMContentLoaded',e=>{
                let efdiv = document.createElement("div");
                efdiv.style.display = "none";
                efdiv.id = this.#efeid;


                this.#downloader = document.createElement("a");
                efdiv.appendChild(this.#downloader);

                let upldr = document.createElement("input");
                upldr.type = "file";
                this.#uploader = upldr;
                efdiv.appendChild(this.#uploader);

                document.body.appendChild(efdiv);
                this.#initialized = true;
            })
        }
        upload(accept){
            return new Promise((res,rej)=>{
            
                if(!this.#initialized){
                    console.error("DOMの初期化が完了していないため、まだEasyFileを使用できません。");
                    rej();
                }
                if(accept.forEach){
                    let acc = "";
                    accept.forEach(e=>{
                        acc += e + ", ";
                    })
                    this.#uploader.accept = acc;
                }else{
                    this.#uploader.accept = accept + "/*";
                }
                //this.#uploader.files.clear();
                this.#uploader.onchange=e=>{
                    if(e.target.files.length < 1) res(null);
                    res(new EasyFileData(e.target.files[0]));
                };
                this.#uploader.oncancel=e=>{
                    res(null);
                }
                this.#uploader.click();
            })
        }
        download(fname,content,mimetype){
            this.#downloader.download = fname;
            this.#downloader.href = URL.createObjectURL(new Blob([content],{type:mimetype}));
            this.#downloader.click();
            URL.revokeObjectURL(this.#downloader.href);
            this.#downloader.href = "";
        }
    }
})()
class EasyFileData{
    rawfd;
    constructor(file){
        this.rawfd = file;
    }
    toBinaryString(){
        return new Promise((res,rej)=>
            this.rawfd.arrayBuffer().then(t=>{
                const ui8aa = new Uint8Array(t);
                const decodebs = u => u.reduce(
                    (bs,u8)=>bs+String.fromCharCode(u8),''
                );
                const bsa = decodebs(ui8aa);
                res(bsa);
            })
        )
    }
    toBase64(){
        return this.toBinaryString().then(r=>btoa(r));
    }
    MimeType(){
        return this.rawfd.type;
    }
    toDataURI(){
        return this.toBase64().then(r=>"data:"+this.MimeType+";base64,"+r);
    }
    Fname(){
        return this.rawfd.name;
    }
    Size(){
        return this.rawfd.size;
    }
}