import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';

@observer
class Text extends React.Component<any, any>{
    constructor(props: any){
        super(props);
    }

    render(){
        return (
            <div>
                { store.text }
            </div>
        )
    }
}

export default Text;