import "./Square.scss";
import { motion } from "framer-motion";

const Square = ({ ind, updateSquares, clsName, size, customText }) => {
    const handleClick = () => {
        if (!updateSquares) return;
        updateSquares(ind);
    };

    const selectSize = (size) => {
        if (size === undefined) return 1;
        let sizes = [0.3, 0.7, 1.3]
        return sizes[size]
    }

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="square badge-container"
            onClick={handleClick}
        >
            {clsName && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: selectSize(size) }}
                    className={clsName}
                ></motion.span>
            )}
            { customText && <div className="badge">
                {customText}
            </div>}
        </motion.div>
    );
};

export default Square;
