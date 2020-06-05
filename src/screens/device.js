import React from 'react';
import { Container, Columns, Button, Image } from 'react-bulma-components';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class DeviceView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imgSrc : "",
            scrollPost: "",
            customScripts: ""
        }
        this._isMounted = false;
        this.useScrollPosition = this.useScrollPosition.bind(this);
        this.resizeWindow = this.resizeWindow.bind(this);
        this.propsState = this.props.location.state[0];
    }
    routeTo = (path, state) => {
        this.props.history.push(path, [state])
    }

    componentDidMount(){
        this._isMounted = true;

        if(this._isMounted){
            const imgSrc= this.propsState.imgSrcDefault;
            let customScripts = this.propsState.customScripts;
            const inHead = this.domParser(customScripts.inHead);
            const inBody = this.domParser(customScripts.inBody);

            this.setState(
                {
                    imgSrc,
                    customScripts: {
                        inHead : inHead !== undefined ? inHead : undefined,
                        inBody : inBody !== undefined ? inBody : undefined
                }},
                this.loadScripts
            );

            window.addEventListener('scroll', this.useScrollPosition);
            window.addEventListener('resize', this.resizeWindow);
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        window.removeEventListener('scroll', this.useScrollPosition);
        window.removeEventListener('resize', this.resizeWindow);
        this.unloadScripts();
    }

    resizeWindow(){
        let windowWidth = window.innerWidth;
        let currentUrl = this.props.match.url;

        if(currentUrl.includes("desktop") && this._isMounted ){
            if(windowWidth <= 480){
                this.setState({
                    imgSrc: this.propsState.imgSrcSub
                });
            }

            if(windowWidth > 480){
                this.setState({
                    imgSrc: this.propsState.imgSrcDefault
                });
            }
        }
    }

    loadScripts(){
        if(this.state.customScripts.inHead !== undefined)
            this.appendRemoveChildren(this.state.customScripts.inHead, 0, true);
        
        if(this.state.customScripts.inBody !== undefined)
            this.appendRemoveChildren(this.state.customScripts.inBody, 0);
    }

    unloadScripts(){
        if(this.state.customScripts.inHead !== undefined)
            this.appendRemoveChildren(this.state.customScripts.inHead, 1, true);
        
        if(this.state.customScripts.inBody !== undefined)
            this.appendRemoveChildren(this.state.customScripts.inBody, 1);
    }

    /**
     * Append/Remove Children Node
     * @param nodeList Child Nodes and a result from parseFromString
     * @param type  Action to take: 0 - append; 1 - remove
     * @param inHead If set to true, the child nodes will be appended/removed in document.head. 
     *               Default value is false, which will append to document.body
     */
    appendRemoveChildren(nodeList, type, inHead = false){  
        if(type === 0){
            for(let node = 0; node < nodeList.length; node++){   
                if(inHead)
                    document.head.appendChild(nodeList[node].cloneNode(true));
                else 
                    document.body.appendChild(nodeList[node].cloneNode(true));
                
                
            }
        }else if(type === 1){
            for(let node = 0; node < nodeList.length; node++){
                if(inHead)
                    document.head.removeChild(document.head.lastChild)
                else
                    document.body.removeChild(document.body.lastChild)
            }
        }
    }

    removeHTMLComments(str){
        const regex = /<!--(.*?)-->/g;
        return  str.trim().replace(regex, '');
    }

    domParser(stringToParse) {
        const parser = new DOMParser();

        if(stringToParse !== undefined){
            const cleanHTML = this.removeHTMLComments(stringToParse);
            // let parsedHtml = parser.parseFromString(cleanHTML, "application/xml"); 

            // if(parsedHtml.getElementsByTagName('parsererror').length > 0){
                let nodes = [];
                const parsedHtml = parser.parseFromString(cleanHTML, "text/html");

                if(parsedHtml.head.childNodes.length > 0){
                    nodes = parsedHtml.head.childNodes;
                }

                if(parsedHtml.body.childNodes.length > 0){
                    nodes = parsedHtml.body.childNodes;
                }
                return nodes;
            // }

            // return parsedHtml.childNodes;
        }
        
        return undefined;
    }

    useScrollPosition(event){
        let scrollPos = event.srcElement.scrollingElement.scrollTop;
        this.setState({ scrollPos })
    }

    render(){
        return(
            <Container fluid className="fullscreen">
                <Columns>
                    <Columns.Column size={12} className={this.state.scrollPos > 40 ? "sticky sticky-full" : "sticky"}>
                        <Button color="primary" onClick={() => this.routeTo("/")}>
                            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                            <span>Go back</span>
                        </Button>
                    </Columns.Column>
                    <Columns.Column size={12}>
                        { this.state.imgSrc === "" 
                        ?   <p>Loading data ...</p>
                        :   <Image src={this.state.imgSrc} />
                        }
                    </Columns.Column>
                </Columns>
            </Container>
        )
    }
}

export default DeviceView;