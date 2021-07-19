/* 
    Setting up tags in a separate file to make it easy to add
    CRUD functionality later. 
*/
import { useEffect } from "react"

export const useTags = (props) => {
    const tags = ["home", "work", "yard", "errand", "partytime"]

    useEffect(() => {
        localStorage.setItem("tags", JSON.stringify(tags))
    })
    
}
