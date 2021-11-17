import React from "react"
import axios from "axios"

// Be sure to create components and send down props.  Style all components (add a css file).

class Main extends React.Component {
    state = {
        memeData: [],
        formData: {
            topText: "",
            bottomText: "",
            url: "",
            id: "",
            name: ""
        },
        memeList: [],
        memeSaveId: 100,
        refreshCount: 0,
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
                name: ""
            }
        }))
        this.getImage()
    }

    handleDelete = (e, memeID) => {
        console.log("delete meme", memeID)
        console.log(e.target)
        this.setState(prevState => ({
            memeList: prevState.memeList.filter(meme => meme.id !== memeID)
        }))
    }

    // handleEdit is not yet functioning

    handleEdit = (e, memeID) => {
        console.log("edit meme", memeID)
        console.log(e.target)
        // Find this meme
        // preview it with inputs in order to change text
        // regenerate it with new state
    }

    componentDidUpdate(){
        console.log(this.state.memeList)
    }

    render(){
        const savedMemes = this.state.memeList.map(meme => (
            <div key={meme.id}>
                <img src= {meme.url} alt= {meme.name} />
                <h2>{meme.topText}</h2>
                <h2>{meme.bottomText}</h2>
                <button onClick= {(e) => this.handleDelete(e, meme.id)}>Delete</button>
                <button onClick= {(e) => this.handleEdit(e, meme.id)}>Edit</button>
            </div>
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