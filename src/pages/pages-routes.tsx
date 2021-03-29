import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { FinalScreen } from './final-screen/final-screen';
import { Robot } from './robot/robot';
import { StartScreen } from './start-screen/start-screen';

export const PagesRoutes = () => {


    return (
        <Switch>
            <Route exact path={'/'} component={(routeProps: RouteComponentProps) => <StartScreen {...routeProps} />}/>
            <Route path={'/robot'} component={(routeProps: RouteComponentProps) => <Robot {...routeProps} />} />
            <Route path={'/final-screen'} component={(routeProps: RouteComponentProps) => <FinalScreen {...routeProps} />} />
        </Switch>
    )
}