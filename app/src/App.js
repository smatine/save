import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { FRT_BASE_URL } from './constants';

import TrigrammeList from './TrigrammeList';
import TrigrammeEdit from './TrigrammeEdit';

import AccountList from './AccountList';
import AccountEdit from './AccountEdit';

import ProductList from './ProductList';
import ProductEdit from './ProductEdit';

import VpcList from './VpcList';
import VpcEdit from './VpcEdit';
import TagVpcList from './TagVpcList';
import TagVpcEdit from './TagVpcEdit';

import SubnetList from './SubnetList';
import SubnetEdit from './SubnetEdit';
import TagSubnetList from './TagSubnetList';
import TagSubnetEdit from './TagSubnetEdit';

import SubnetGroupList from './SubnetGroupList';
import SubnetGroupEdit from './SubnetGroupEdit';

import CognitoList from './CognitoList';
import CognitoEdit from './CognitoEdit';

import DynamoDbList from './DynamoDbList';
import DynamoDbEdit from './DynamoDbEdit';

import SsmList from './SsmList';
import SsmEdit from './SsmEdit';

import StorageList from './StorageList';
import StorageEdit from './StorageEdit';
import StorageAclList from './StorageAclList';
import StorageAclEdit from './StorageAclEdit';
import TagStorageList from './TagStorageList';
import TagStorageEdit from './TagStorageEdit';

import RdsList from './RdsList';
import RdsEdit from './RdsEdit';

import EfsList from './EfsList';
import EfsEdit from './EfsEdit';
import TagEfsList from './TagEfsList';
import TagEfsEdit from './TagEfsEdit';

import ElasticSearchList from './ElasticSearchList';
import ElasticSearchEdit from './ElasticSearchEdit';

import ElasticCacheList from './ElasticCacheList';
import ElasticCacheEdit from './ElasticCacheEdit';

import NaclList from './NaclList';
import NaclEdit from './NaclEdit';
import RuleList from './RuleList';
import RuleEdit from './RuleEdit';
import TagList from './TagList';
import TagEdit from './TagEdit';


import RouteTableList from './RouteTableList';
import RouteTableEdit from './RouteTableEdit';
import RouteList from './RouteList';
import RouteEdit from './RouteEdit';
import TagRouteTableList from './TagRouteTableList';
import TagRouteTableEdit from './TagRouteTableEdit';



import TargetGroupList from './TargetGroupList';
import TargetGroupEdit from './TargetGroupEdit';
import TargetList from './TargetList';
import TargetEdit from './TargetEdit';
import TagTargetGroupList from './TagTargetGroupList';
import TagTargetGroupEdit from './TagTargetGroupEdit';

import LbList from './LbList';
import LbEdit from './LbEdit';
import ListenerList from './ListenerList';
import ListenerEdit from './ListenerEdit';
import TagLbList from './TagLbList';
import TagLbEdit from './TagLbEdit';

import PeeringList from './PeeringList';
import PeeringEdit from './PeeringEdit';
import TagPeeringList from './TagPeeringList';
import TagPeeringEdit from './TagPeeringEdit';

import SgList from './SgList';
import SgEdit from './SgEdit';
import RuleSgList from './RuleSgList';
import RuleSgEdit from './RuleSgEdit';
import TagSgList from './TagSgList';
import TagSgEdit from './TagSgEdit';

import VpcManageList from './VpcManageList';
import VpcManageEdit from './VpcManageEdit';
import SubnetManageList from './SubnetManageList';
import SubnetManageEdit from './SubnetManageEdit';

import RegionList from './RegionList';
import RegionEdit from './RegionEdit';
import AzList from './AzList';
import AzEdit from './AzEdit';
import AmiList from './AmiList';
import AmiEdit from './AmiEdit';

import InstanceTypeList from './InstanceTypeList';
import InstanceTypeEdit from './InstanceTypeEdit';

import EccList from './EccList';
import EccEdit from './EccEdit';
import EccStorageList from './EccStorageList';
import EccStorageEdit from './EccStorageEdit';
import EccNetworkInterfaceList from './EccNetworkInterfaceList';
import EccNetworkInterfaceEdit from './EccNetworkInterfaceEdit';
import TagEccList from './TagEccList';
import TagEccEdit from './TagEccEdit';

import LaunchConfigurationList from './LaunchConfigurationList';
import LaunchConfigurationEdit from './LaunchConfigurationEdit';
import LaunchConfigurationStorageList from './LaunchConfigurationStorageList';
import LaunchConfigurationStorageEdit from './LaunchConfigurationStorageEdit';

import AutoScalingGroupList from './AutoScalingGroupList';
import AutoScalingGroupEdit from './AutoScalingGroupEdit';
import TagAutoScalingGroupList from './TagAutoScalingGroupList';
import TagAutoScalingGroupEdit from './TagAutoScalingGroupEdit';

import PolicyList from './PolicyList';
import PolicyEdit from './PolicyEdit';

import EndPointList from './EndPointList';
import EndPointEdit from './EndPointEdit';


import RoleList from './RoleList';
import RoleEdit from './RoleEdit';

import GroupList from './GroupList';
import GroupEdit from './GroupEdit';

import UserList from './UserList';
import UserEdit from './UserEdit';


import DhcpList from './DhcpList';
import DhcpEdit from './DhcpEdit';
import TagDhcpList from './TagDhcpList';
import TagDhcpEdit from './TagDhcpEdit';

import KmsList from './KmsList';
import KmsEdit from './KmsEdit';


class App extends Component { 
  render() {
    return (
      <Router>
        <Switch>
          <Route path={`${FRT_BASE_URL}`} exact={true} component={Home}/>

          <Route path={`${FRT_BASE_URL}/regions`} exact={true} component={RegionList}/>
          <Route path={`${FRT_BASE_URL}/regions/:id`} component={RegionEdit}/>
          <Route path={`${FRT_BASE_URL}/region/:id/azs`} exact={true} component={AzList}/>
          <Route path={`${FRT_BASE_URL}/region/:idr/azs/:id`} component={AzEdit}/>
          <Route path={`${FRT_BASE_URL}/region/:id/amis`} exact={true} component={AmiList}/>
          <Route path={`${FRT_BASE_URL}/region/:idr/amis/:id`} component={AmiEdit}/>

          <Route path={`${FRT_BASE_URL}/instancetypes`} exact={true} component={InstanceTypeList}/>
          <Route path={`${FRT_BASE_URL}/instancetypes/:id`} component={InstanceTypeEdit}/>


          <Route path={`${FRT_BASE_URL}/kmss`} exact={true} component={KmsList}/>
          <Route path={`${FRT_BASE_URL}/kmss/:id`} component={KmsEdit}/>

          <Route path={`${FRT_BASE_URL}/policys`} exact={true} component={PolicyList}/>
          <Route path={`${FRT_BASE_URL}/policys/:id`} component={PolicyEdit}/>

          <Route path={`${FRT_BASE_URL}/roles`} exact={true} component={RoleList}/>
          <Route path={`${FRT_BASE_URL}/roles/:id`} component={RoleEdit}/>

          <Route path={`${FRT_BASE_URL}/groups`} exact={true} component={GroupList}/>
          <Route path={`${FRT_BASE_URL}/groups/:id`} component={GroupEdit}/>

          <Route path={`${FRT_BASE_URL}/users`} exact={true} component={UserList}/>
          <Route path={`${FRT_BASE_URL}/users/:id`} component={UserEdit}/>

          <Route path={`${FRT_BASE_URL}/endpoints`} exact={true} component={EndPointList}/>
          <Route path={`${FRT_BASE_URL}/endpoints/:id`} component={EndPointEdit}/>


          <Route path={`${FRT_BASE_URL}/launchconfigurations`} exact={true} component={LaunchConfigurationList}/>
          <Route path={`${FRT_BASE_URL}/launchconfigurations/:id`} component={LaunchConfigurationEdit}/>
          <Route path={`${FRT_BASE_URL}/launchconfiguration/:id/launchConfigurationStorages`} exact={true} component={LaunchConfigurationStorageList}/>
          <Route path={`${FRT_BASE_URL}/launchconfiguration/:idl/launchConfigurationStorages/:id`} component={LaunchConfigurationStorageEdit}/>


          <Route path={`${FRT_BASE_URL}/autoscalinggroups`} exact={true} component={AutoScalingGroupList}/>
          <Route path={`${FRT_BASE_URL}/autoscalinggroups/:id`} component={AutoScalingGroupEdit}/>
          <Route path={`${FRT_BASE_URL}/autoscalinggroup/:id/tags`} exact={true} component={TagAutoScalingGroupList}/>
          <Route path={`${FRT_BASE_URL}/autoscalinggroup/:ida/tags/:id`} component={TagAutoScalingGroupEdit}/>



          <Route path={`${FRT_BASE_URL}/eccs`} exact={true} component={EccList}/>
          <Route path={`${FRT_BASE_URL}/eccs/:id`} component={EccEdit}/>
          <Route path={`${FRT_BASE_URL}/ecc/:id/eccStorages`} exact={true} component={EccStorageList}/>
          <Route path={`${FRT_BASE_URL}/ecc/:ide/eccStorages/:id`} component={EccStorageEdit}/>
          <Route path={`${FRT_BASE_URL}/ecc/:id/eccNetworkInterfaces`} exact={true} component={EccNetworkInterfaceList}/>
          <Route path={`${FRT_BASE_URL}/ecc/:ide/eccNetworkInterfaces/:id`} component={EccNetworkInterfaceEdit}/>
          <Route path={`${FRT_BASE_URL}/ecc/:id/tags`} exact={true} component={TagEccList}/>
          <Route path={`${FRT_BASE_URL}/ecc/:ide/tags/:id`} component={TagEccEdit}/>

          <Route path={`${FRT_BASE_URL}/trigrammes`} exact={true} component={TrigrammeList}/>
		  <Route path={`${FRT_BASE_URL}/trigrammes/:id`} component={TrigrammeEdit}/>

          <Route path={`${FRT_BASE_URL}/products`} exact={true} component={ProductList}/>
          <Route path={`${FRT_BASE_URL}/products/:id`} component={ProductEdit}/>
          <Route path={`${FRT_BASE_URL}/trigramme/:id/products`} exact={true} component={ProductList}/>
          <Route path={`${FRT_BASE_URL}/trigramme/:idt/products/:id`} component={ProductEdit}/>

          <Route path={`${FRT_BASE_URL}/accounts`} exact={true} component={AccountList}/>
          <Route path={`${FRT_BASE_URL}/accounts/:id`} component={AccountEdit}/>
          <Route path={`${FRT_BASE_URL}/trigramme/:id/accounts`} exact={true} component={AccountList}/>
          <Route path={`${FRT_BASE_URL}/trigramme/:idt/accounts/:id`} component={AccountEdit}/>

          <Route path={`${FRT_BASE_URL}/vpcs`} exact={true} component={VpcList}/>
          <Route path={`${FRT_BASE_URL}/vpcs/:id`} component={VpcEdit}/>
          <Route path={`${FRT_BASE_URL}/account/:id/vpcs`} exact={true} component={VpcList}/>
          <Route path={`${FRT_BASE_URL}/account/:ida/vpcs/:id`} component={VpcEdit}/>
          <Route path={`${FRT_BASE_URL}/vpc/:id/tags`} exact={true} component={TagVpcList}/>
          <Route path={`${FRT_BASE_URL}/vpc/:idv/tags/:id`} component={TagVpcEdit}/>

          <Route path={`${FRT_BASE_URL}/dhcps`} exact={true} component={DhcpList}/>
          <Route path={`${FRT_BASE_URL}/dhcps/:id`} component={DhcpEdit}/>
          <Route path={`${FRT_BASE_URL}/dhcp/:id/tags`} exact={true} component={TagDhcpList}/>
          <Route path={`${FRT_BASE_URL}/dhcp/:idd/tags/:id`} component={TagDhcpEdit}/>


          <Route path={`${FRT_BASE_URL}/subnets`} exact={true} component={SubnetList}/>
          <Route path={`${FRT_BASE_URL}/subnets/:id`} component={SubnetEdit}/>
          <Route path={`${FRT_BASE_URL}/vpc/:id/subnets`} exact={true} component={SubnetList}/>
          <Route path={`${FRT_BASE_URL}/vpc/:idv/subnets/:id`} component={SubnetEdit}/>
          <Route path={`${FRT_BASE_URL}/subnet/:id/tags`} exact={true} component={TagSubnetList}/>
          <Route path={`${FRT_BASE_URL}/subnet/:ids/tags/:id`} component={TagSubnetEdit}/>


          <Route path={`${FRT_BASE_URL}/subnetGroups`} exact={true} component={SubnetGroupList}/>
          <Route path={`${FRT_BASE_URL}/subnetGroups/:id`} component={SubnetGroupEdit}/>

          <Route path={`${FRT_BASE_URL}/storages`} exact={true} component={StorageList}/>
          <Route path={`${FRT_BASE_URL}/storages/:id`} component={StorageEdit}/>
          <Route path={`${FRT_BASE_URL}/storage/:id/storageacls`} exact={true} component={StorageAclList}/>
          <Route path={`${FRT_BASE_URL}/storage/:ids/storageacls/:id`} component={StorageAclEdit}/>
          <Route path={`${FRT_BASE_URL}/storage/:id/tags`} exact={true} component={TagStorageList}/>
          <Route path={`${FRT_BASE_URL}/storage/:ids/tags/:id`} component={TagStorageEdit}/>


          <Route path={`${FRT_BASE_URL}/ssms`} exact={true} component={SsmList}/>
          <Route path={`${FRT_BASE_URL}/ssms/:id`} component={SsmEdit}/>

          <Route path={`${FRT_BASE_URL}/cognitos`} exact={true} component={CognitoList}/>
          <Route path={`${FRT_BASE_URL}/cognitos/:id`} component={CognitoEdit}/>

          <Route path={`${FRT_BASE_URL}/dynamoDbs`} exact={true} component={DynamoDbList}/>
          <Route path={`${FRT_BASE_URL}/dynamoDbs/:id`} component={DynamoDbEdit}/>

          <Route path={`${FRT_BASE_URL}/rdss`} exact={true} component={RdsList}/>
          <Route path={`${FRT_BASE_URL}/rdss/:id`} component={RdsEdit}/>

          <Route path={`${FRT_BASE_URL}/efss`} exact={true} component={EfsList}/>
          <Route path={`${FRT_BASE_URL}/efss/:id`} component={EfsEdit}/>
          <Route path={`${FRT_BASE_URL}/efs/:id/tags`} exact={true} component={TagEfsList}/>
          <Route path={`${FRT_BASE_URL}/efs/:ide/tags/:id`} component={TagEfsEdit}/>

          <Route path={`${FRT_BASE_URL}/elasticSearchs`} exact={true} component={ElasticSearchList}/>
          <Route path={`${FRT_BASE_URL}/elasticSearchs/:id`} component={ElasticSearchEdit}/>

          <Route path={`${FRT_BASE_URL}/elasticCaches`} exact={true} component={ElasticCacheList}/>
          <Route path={`${FRT_BASE_URL}/elasticCaches/:id`} component={ElasticCacheEdit}/>

          <Route path={`${FRT_BASE_URL}/nacls`} exact={true} component={NaclList}/>
          <Route path={`${FRT_BASE_URL}/nacls/:id`} component={NaclEdit}/>
          <Route path={`${FRT_BASE_URL}/nacl/:id/rules`} exact={true} component={RuleList}/>
          <Route path={`${FRT_BASE_URL}/nacl/:idn/rules/:id`} component={RuleEdit}/>
          <Route path={`${FRT_BASE_URL}/nacl/:id/tags`} exact={true} component={TagList}/>
          <Route path={`${FRT_BASE_URL}/nacl/:idn/tags/:id`} component={TagEdit}/>


          <Route path={`${FRT_BASE_URL}/routetables`} exact={true} component={RouteTableList}/>
          <Route path={`${FRT_BASE_URL}/routetables/:id`} component={RouteTableEdit}/>
          <Route path={`${FRT_BASE_URL}/routetable/:id/routes`} exact={true} component={RouteList}/>
          <Route path={`${FRT_BASE_URL}/routetable/:idr/routes/:id`} component={RouteEdit}/>
          <Route path={`${FRT_BASE_URL}/routetable/:id/tags`} exact={true} component={TagRouteTableList}/>
          <Route path={`${FRT_BASE_URL}/routetable/:idr/tags/:id`} component={TagRouteTableEdit}/>


          <Route path={`${FRT_BASE_URL}/targetgroups`} exact={true} component={TargetGroupList}/>
          <Route path={`${FRT_BASE_URL}/targetgroups/:id`} component={TargetGroupEdit}/>
          <Route path={`${FRT_BASE_URL}/targetgroup/:id/targets`} exact={true} component={TargetList}/>
          <Route path={`${FRT_BASE_URL}/targetgroup/:idt/targets/:id`} component={TargetEdit}/>
          <Route path={`${FRT_BASE_URL}/targetgroup/:id/tags`} exact={true} component={TagTargetGroupList}/>
          <Route path={`${FRT_BASE_URL}/targetgroup/:idr/tags/:id`} component={TagTargetGroupEdit}/>

          <Route path={`${FRT_BASE_URL}/lbs`} exact={true} component={LbList}/>
          <Route path={`${FRT_BASE_URL}/lbs/:id`} component={LbEdit}/>
          <Route path={`${FRT_BASE_URL}/lb/:id/listeners`} exact={true} component={ListenerList}/>
          <Route path={`${FRT_BASE_URL}/lb/:idl/listeners/:id`} component={ListenerEdit}/>
          <Route path={`${FRT_BASE_URL}/lb/:id/tags`} exact={true} component={TagLbList}/>
          <Route path={`${FRT_BASE_URL}/lb/:idl/tags/:id`} component={TagLbEdit}/>

          <Route path={`${FRT_BASE_URL}/peerings`} exact={true} component={PeeringList}/>
          <Route path={`${FRT_BASE_URL}/peerings/:id`} component={PeeringEdit}/>
          <Route path={`${FRT_BASE_URL}/peering/:id/tags`} exact={true} component={TagPeeringList}/>
          <Route path={`${FRT_BASE_URL}/peering/:idp/tags/:id`} component={TagPeeringEdit}/>

          <Route path={`${FRT_BASE_URL}/sgs`} exact={true} component={SgList}/>
          <Route path={`${FRT_BASE_URL}/sgs/:id`} component={SgEdit}/>
          <Route path={`${FRT_BASE_URL}/sg/:id/ruleSgs`} exact={true} component={RuleSgList}/>
          <Route path={`${FRT_BASE_URL}/sg/:ids/ruleSgs/:id`} component={RuleSgEdit}/>
          <Route path={`${FRT_BASE_URL}/sg/:id/tags`} exact={true} component={TagSgList}/>
          <Route path={`${FRT_BASE_URL}/sg/:ids/tags/:id`} component={TagSgEdit}/>



          <Route path={`${FRT_BASE_URL}/vpcmanage`} exact={true} component={VpcManageList}/>
          <Route path={`${FRT_BASE_URL}/vpcmanage/:id`} component={VpcManageEdit}/>


          <Route path={`${FRT_BASE_URL}/vpcmanages/:id/subnetmanage`} exact={true} component={SubnetManageList}/>
          <Route path={`${FRT_BASE_URL}/vpcmanages/:idc/subnetmanage/:id`} component={SubnetManageEdit}/>


        </Switch>
      </Router>
    )
  }
}

export default App;