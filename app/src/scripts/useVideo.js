


export const useVideo = () => {


    const startVideo = (id, errorFunction) => {

        const specs = { video: {aspectRatio: 4/3}}


        navigator.mediaDevices.getUserMedia(specs).then(stream =>  {


            const videoElement =  document.querySelector("#" + id)

            videoElement.srcObject = stream


        }).catch(() => { 
            alert("Ocorreu um erro ao inciar o video!")
            errorFunction()
        })

    }

    const takePicture = (id) => {


        const video = document.getElementById(id)
        const container = document.getElementById("imageTextAnaliser")
	
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        container.style.animationName = "photo"
        
       
        const dataURI = canvas.toDataURL(); 
        
        return base64LtoFile(dataURI, "imagem.png")

    }

    function base64LtoFile(url, filename) {
        var arr = url.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }


    return { startVideo, takePicture }
}