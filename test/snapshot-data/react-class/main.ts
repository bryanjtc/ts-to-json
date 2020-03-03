import React from "react";
import { Props } from "./props";

interface OwnProps extends Props {
    prop: string;
}

export default class ClassStandard extends React.Component<OwnProps> {
    render() {
        return null;
    }
}
