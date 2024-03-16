async function uppic(){
    let f = await EasyFile.upload("image");
    if(!f){
        alert("ねえ、今、画像アップロードしなかったよね？");
        return;
    }
    document.querySelector("img").src = await f.toDataURI();
}
async function updown(){
    let f = await EasyFile.upload("*");
    if(!f){
        alert("ねえねえ、アップロードしないのはずるいよ？");
    }
    EasyFile.download(f.Fname(),await f.toBinaryString(),f.MimeType())
}
function dltext(){
    EasyFile.download("text.txt",document.querySelector("textarea").value,"text/plain")
}