import { FC } from "react";

type Props = {
    children: string | JSX.Element
    renderIf: boolean
}

const RenderCase: FC<Props> = ({ children, renderIf }) => {
    return renderIf ? children : <></>
};

export default RenderCase;
