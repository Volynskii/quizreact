import React from 'react';

const ProgressBar = ({progressBarWidth}) => {

    return (
        <div className="progressBar">
            <div style={{ width: `${progressBarWidth}%` }} className="progressBar__filled"></div>
        </div>
    );
};

export default ProgressBar;