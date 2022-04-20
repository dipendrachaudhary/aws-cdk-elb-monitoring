import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Alarm, AlarmActionConfig } from '@aws-cdk/aws-cloudwatch';
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import { Topic } from "@aws-cdk/aws-sns";

export class ElbMonitoringStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVpc",
    {
      isDefault: true,
    })

    const lb = new elbv2.ApplicationLoadBalancer(this, 'sthapa-LB', {
      vpc,
      internetFacing: true,
    });

    const topic =  Topic.fromTopicArn( this, 'sns',"arn:aws:sns:ap-south-1:885300287765:sthapa-admin-DB");

    const Latency = new cloudwatch.Metric({
      namespace: 'AWS/ApplicationELB',
      metricName: 'Latency',
      // dimensionsMap: {
      //   dbClusterIdentifier: cluster.clusterIdentifier
      // }
    });

    const alarm = new cloudwatch.Alarm(this, 'Alarm', {
      metric: Latency,
      threshold: 100,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

  }
}
