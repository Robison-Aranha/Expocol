



export const useResizeCalendar = () => {

    
    const resizeCalendar = (resizeFunctionMobile, resizeFunctionPc) => {

        window.onresize = () => {

            if (window.screen.width <= 850) {
                resizeFunctionMobile()
            } else {
                resizeFunctionPc()
            }

        }
    }


    return { resizeCalendar }

}