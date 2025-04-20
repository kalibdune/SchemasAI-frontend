import Lottie from "lottie-react";
import animationData from "../../assets/flow-animation.json";

function FlowAnimation() {
    return (
        <div className="w-screen h-screen fixed top-0 left-0 z-0">
            <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-full h-full object-cover"
            />
        </div>
    );
}

export default FlowAnimation;