
export const useReognizeScroll = () => {

    const organizeScroll = (id) => {
        var objDiv = document.getElementById(id)
        
        if (Math.abs(objDiv.scrollHeight - objDiv.clientHeight - objDiv.scrollTop) < 100) {

            objDiv.scrollTop = objDiv.scrollHeight;
            
        }
    }


    return { organizeScroll }

}