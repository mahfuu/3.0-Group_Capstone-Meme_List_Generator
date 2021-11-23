import React from "react"
import axios from "axios"

import Meme from "./Meme"

// Be sure to create components and send down props.  Style all components (add a css file).

class Main extends React.Component {
    state = {
        memeData: [],
        formData: {
            topText: "",
            bottomText: "",
            url: "",
            id: "",
            name: "",
            isEditing: false
        },
        memeList: [],
        memeSaveId: 100,
        refreshCount: 0,
        memeEdit: {
            topText: "",
            bottomText: "",
            url: "",
            id: "",
            name: "",
            isEditing: false
        }
    }

    componentDidMount(){
        axios.get("https://api.imgflip.com/get_memes")
            .then(res => {
                const getMemeData = res.data.data.memes
                this.setState(prevState => ({
                    memeData: [...prevState.memeData, ...getMemeData]
                }))
                this.getImage()
            })
            .catch(err => console.log(err))
    }

    getImage = () => {
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                url: prevState.memeData[(prevState.refreshCount)].url,
                id: prevState.memeData[(prevState.refreshCount)].id + "." + prevState.memeSaveId,
                name: prevState.memeData[(prevState.refreshCount)].name
            }
        }))
    }

    handleNewImageButton = () => {
        const {memeData, refreshCount} = this.state
        if(refreshCount < memeData.length - 1 && memeData.length > 0) {
            this.setState(prevState => ({
                refreshCount: prevState.refreshCount + 1
            }))
            this.getImage()
        } else {
            this.setState({
                refreshCount: 0,
            })
            this.getImage()
        } 
        
    }

    handleChange = e => {
        const {name, value} = e.target
        this.setState(prevState => ({
            formData: {...prevState.formData, [name]: value}
        }))
    }

    generateMeme = e => {
        e.preventDefault()
        this.setState(prevState => ({
            memeList: [...prevState.memeList, prevState.formData],
            memeSaveId: prevState.memeSaveId + 1,
            formData: {
                topText: "",
                bottomText: "",
                url: "",
                id: "",
                name: "",
                isEditing: false
            }
        }))
        this.getImage()
    }

    handleDelete = (e, memeID) => {
        console.log("handle delete")
        this.setState(prevState => ({
            memeList: prevState.memeList.filter(meme => meme.id !== memeID)
        }))
    }

    handleEdit = (e, memeID) => {
        console.log("handle edit")
        this.setState(prevState => ({
            memeList: prevState.memeList.map(prevMeme => (
                prevMeme.id === memeID ?
                {   
                    ...prevMeme,
                    isEditing: !prevMeme.isEditing
                } :
                prevMeme
            ))
        }))
        this.setState(prevState => ({
            memeEdit: prevState.memeList.find(prevMeme => (
                prevMeme.id === memeID ?
                {...prevMeme} :
                null
            ))  
        }))
        
    }

    handleEditChange = e => {
        const {name, value} = e.target
        this.setState(prevState => ({
            memeEdit: {...prevState.memeEdit, [name]: value}
        }))
    }

    handleSaveChanges = (e, memeID) => {
        e.preventDefault()
        console.log(memeID)
        this.setState(prevState => ({
            memeList: prevState.memeList.map(prevMeme => (
                prevMeme.id === memeID ?
                {   
                    ...prevState.memeEdit,
                    isEditing: !prevMeme.isEditing
                } :
                prevMeme
            )),
            memeEdit: 
                {
                    topText: "",
                    bottomText: "",
                    url: "",
                    id: "",
                    name: "",
                    isEditing: false
                }
        }))
    }

    componentDidUpdate(){
        console.log(this.state.refreshCount)
    }

    render(){
        const savedMemes = this.state.memeList.map(meme => (
            <Meme
                key={meme.id}
                data={meme}
                delete={this.handleDelete}
                edit={this.handleEdit}
                handleChange={this.handleEditChange}
                handleSave={this.handleSaveChanges}
                topValue={this.state.memeEdit.topText}
                bottomValue={this.state.memeEdit.bottomText}
            />
        ))
        return(
            <main>
                <div>
                    <button onClick={this.handleNewImageButton}>
                        New meme image
                    </button>
                    <form>
                        <input 
                            type="text"
                            placeholder="Top Text"
                            name="topText"
                            value={this.state.formData.topText}
                            onChange={this.handleChange}
                        />
                        <input 
                            type="text"
                            placeholder="Bottom Text"
                            name="bottomText"
                            value={this.state.formData.bottomText}
                            onChange={this.handleChange}
                        />
                        <button onClick={this.generateMeme}>
                            Generate meme
                        </button>
                    </form>
                </div>
                <div>
                    <img
                        src={this.state.memeData.length > 0 ?
                            this.state.memeData[(this.state.refreshCount)].url :
                            "https://i.redd.it/lqkqfk4rpy701.jpg"}
                        alt="ourmemes"
                    />
                    <h2>{this.state.formData.topText}</h2>
                    <h2>{this.state.formData.bottomText}</h2>
                </div>
                <div>
                    {savedMemes}
                </div>
            </main>
        )
    }
}

export default Main