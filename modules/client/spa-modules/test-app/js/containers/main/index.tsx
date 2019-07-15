import * as React from 'react';

import Text from '../../components/text';

import './style.scss';

class MainContainer extends React.Component<any, any>{
    
    constructor(props: any){
        super(props);
    }

    render(){
        return (
            <div styleName='main-container'>
                <h1>Hello World</h1>
                <div styleName='bg-img'></div>
                <div style={{ fontSize: '36px' }}>
                    <Text />
                </div>
            </div>
        )
    }
}

export default MainContainer;