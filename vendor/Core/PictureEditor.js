import React, {Component} from 'react';

class PictureEditor extends Component
{
    constructor(props) {
        super(props)
        this.input = React.createRef()
        this.imgContainer = React.createRef()
    }
    
    componentDidMount() {
        $(this.input.current).on('change', e=>{
			if (e.target.files && e.target.files.length>0) {
				var reader = new FileReader();
			
				reader.onload = e=>{
					$(this.imgContainer.current).attr('src', e.target.result);
				};
			
				reader.readAsDataURL(e.target.files[0]);
			}
		});
    }

    render() {
        return <React.Fragment>
            <input ref={this.input} type="file" name={this.props.name} id={`mass-pic`} className="d-none"/>
            <input type="hidden" name={`prev_${this.props.name}`} value={this.props.src}/>
            <label htmlFor="mass-pic" className="mouse-pointable">
                <img ref={this.imgContainer} src={this.props.src} className="img-fluid img-thumbnail"/>
            </label>
        </React.Fragment>
    }
}

export default PictureEditor