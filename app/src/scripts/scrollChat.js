
export const useReognizeScroll = () => {

    const organizeScroll = (id) => {
        var objDiv = document.getElementById(id)
        
        if (objDiv.childElementCount > 0) {

            
            
            const value = objDiv.scrollTop + objDiv.clientHeight + objDiv.children[objDiv.childElementCount - 1].clientHeight + 15


                if (Math.round(value) >= Math.round(objDiv.scrollHeight)) {
        
                    objDiv.scrollTop = objDiv.scrollHeight;
                        
                }
        }
        
    }


    return { organizeScroll }

}