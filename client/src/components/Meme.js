import React from "react"

function Meme(props) {
    return(
        <div>
            <img src= {props.data.url} alt= {props.data.name} />
            <h2>{props.data.topText}</h2>
            <h2>{props.data.bottomText}</h2>
            {props.data.isEditing ?
                (<form>
                    <input
                        type="text"
                        placeholder="Top Text"
                        name="topText"
                        value={props.topValue}
                        onChange={props.handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Bottom Text"
                        name="bottomText"
                        value={props.bottomValue}
                        onChange= {props.handleChange}
                    />
                    <button onClick= {e => props.handleSave(e, props.data.id)}>Save Changes</button>
                </form>) :
                (<>
                    <button onClick= {e => props.delete(e, props.data.id)}>Delete</button>
                    <button onClick= {e => props.edit(e, props.data.id)}>Edit</button>                    
                </>)
            }
        </div>
    )
}

export default Meme