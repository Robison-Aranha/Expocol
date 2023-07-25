

export const useSetScrollTop = () => {

    const setScrollTop = (id) => {

        var objDiv = document.getElementById(id)
        
        objDiv.scrollTop = 0;        
    
    }


    return { setScrollTop }

}