
export const useReognizeScroll = () => {

    const organizeScroll = (id) => {
        var objDiv = document.getElementById(id)
        
        if (objDiv.childElementCount > 0) {

            
        const value = objDiv.scrollTop + objDiv.clientHeight + objDiv.children[objDiv.childElementCount - 1].clientHeight + 10

            if (Math.round(value) >= objDiv.scrollHeight - 10) {
       
                objDiv.scrollTop = objDiv.scrollHeight;
                    
            }
        }
        
    }


    return { organizeScroll }

}