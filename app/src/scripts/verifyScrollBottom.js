export const useVerifyScrollBottom = () => {

    const verifyScrollBottom = (setFunction, id) => {

        
        
        document.querySelector("#" + id).addEventListener('scroll', function() { 

            console.log(Math.round(this.scrollTop + this.offsetHeight), Math.round(this.scrollHeight))
            
            if (Math.round(this.scrollTop + this.offsetHeight) >= Math.round(this.scrollHeight) - 2) {
                
                setFunction()
            } 
        }); 

    }


    return { verifyScrollBottom }

}