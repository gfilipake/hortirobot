import React from "react";
import { RouteComponentProps } from "react-router";
import "./final-screen.scss";

interface IFinalScreenProps
  extends RouteComponentProps<any, any, { movementString?: string } | any> {}

interface IFinalScreenState {
  movementString?: string;
}

export class FinalScreen extends React.Component<
  IFinalScreenProps,
  IFinalScreenState
> {
  constructor(props: IFinalScreenProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { history } = this.props;

    if (history?.location?.state?.movementString) {
      this.setState({
        movementString: history.location.state.movementString,
      });
      return;
    }

    this.props.history.replace("/");
  }

  renderHeader = () => {
    if (!this.state.movementString) {
      return <div />;
    }

    return (
      <>
        <span className="title bold">
          Parabéns, você conseguiu irrigar todos os canteiros!
          <br />
          Movimentos utilizados:
          <br />
          {this.state.movementString}
        </span>
      </>
    );
  };

  renderButton = () => <button onClick={this.pushToInit}>Reiniciar</button>;

  pushToInit = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <div className="final-screen-container">
        {this.renderHeader()}
        {this.renderButton()}
      </div>
    );
  }
}
