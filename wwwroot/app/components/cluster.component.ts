﻿import {Component, OnInit, OnDestroy, ElementRef, ViewChildren, ViewChild, QueryList} from 'angular2/core';
import {Observable}     from 'rxjs/Observable';
import {MetricComponent} from './metriccomponent';
import {ApplicationComponent} from './application.component';

import {NodeViewModel} from './../viewmodels/nodeviewmodel';
import {NodeCapacityViewModel} from './../viewmodels/nodecapacityviewmodel';
import {ClusterCapacityViewModel} from './../viewmodels/clustercapacityviewmodel';
import {List} from './../viewmodels/list';

import {DataService} from './../services/data.service';

@Component({
    selector: 'cluster-component',
    templateUrl: 'app/components/cluster.component.html',
    styleUrls: ['app/components/cluster.component.css'],
    directives: [ApplicationComponent]
})

export class ClusterComponent extends MetricComponent implements OnInit {

    @ViewChild("container")
    protected container: ElementRef;

    @ViewChildren(ApplicationComponent)
    private applicationComponents: QueryList<ApplicationComponent>

    private containerHeight = 0;
    private expanded: boolean;
    private scaleFactor: number;
    private nodes: NodeViewModel[];
    private capacities: ClusterCapacityViewModel[];

    constructor(
        private dataService: DataService)
    {
        super();
        
        this.scaleFactor = 1;
        this.expanded = true;
        this.selectedColors = 'status';
        this.nodes = [];
        this.capacities = [];
    }

    protected getElementHeight(capacity: number): number {

        return Math.max(0, (capacity * this.scaleFactor) - this.getOuterVerticalSpacing(this.container));
    }

    private getSelectedCapacity(capacities: NodeCapacityViewModel[]): number {
        let result = capacities.find(x => x.name == this.selectedMetricName);
        
        return result ? result.capacity : 0;
    }

    private toggleExpand() {
        this.expanded = !this.expanded;
        this.applicationComponents.forEach(x => x.toggleSelectAll(this.expanded));
    }

    private onChangeCapacity(newValue) {
        this.selectedMetricName = newValue;
    }

    private onChangeColors(newValue) {
        this.selectedColors = newValue;
    }


    public ngOnInit() {
        this.dataService.getNodes().subscribe(
            result => {
                if (!result) {
                    return;
                }

                List.updateList(this.nodes, result.map(x =>
                    new NodeViewModel(
                        x.name,
                        x.status.toLowerCase(),
                        x.healthState.toLowerCase(),
                        x.faultDomain,
                        x.upgradeDomain,
                        x.capacities.map(y =>
                            new NodeCapacityViewModel(
                                y.isCapacityViolation,
                                y.name,
                                y.bufferedCapacity,
                                y.capacity,
                                y.load,
                                y.remainingBufferedCapacity,
                                y.remainingCapacity)))));
            },
            error => console.log("error from observable: " + error));
                

        this.dataService.getClusterCapacity().subscribe(
            result => {
                if (!result) {
                    return;
                }

                List.updateList(this.capacities, result.map(x =>
                    new ClusterCapacityViewModel(
                        x.bufferedCapacity,
                        x.capacity,
                        x.load,
                        x.remainingBufferedCapacity,
                        x.remainingCapacity,
                        x.isClusterCapacityViolation,
                        x.name,
                        x.bufferPercentage)));
            },
            error => console.log("error from observable: " + error));
    }
}
