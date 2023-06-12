
export const useSetScrollDown = () => {

    const setScrollDown = (id) => {

        var objDiv = document.getElementById(id)
        
        objDiv.scrollTop = objDiv.scrollHeight;        
    
    }


    return { setScrollDown }

}