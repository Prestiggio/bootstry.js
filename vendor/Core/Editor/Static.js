import React, {Component} from 'react';
import Editable from 'Core/Editable';
import Ry from 'Core/Ry';

class StaticPage extends Component
{
  render() {
    return <Ry class={this.props.data.layout} content={this.props.data}>
        <div ref={el=>this.setEditable(el, 'static_page')}></div>
    </Ry>
  }
}

export default Editable(StaticPage)