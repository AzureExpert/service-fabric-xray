﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Xray.Models
{
    public struct ClusterNode
    {
        public ClusterNode(
            string name,
            string status,
            string healthState,
            string fd,
            string ud,
            IEnumerable<ClusterNodeCapacity> capacities)
        {
            this.Name = name;
            this.Status = status;
            this.HealthState = healthState;
            this.FaultDomain = fd;
            this.UpgradeDomain = ud;
            this.Capacities = capacities;
        }

        public string Name { get; }

        public string Status { get; }
        
        public string HealthState { get; }

        public string FaultDomain { get; }

        public string UpgradeDomain { get; }

        public IEnumerable<ClusterNodeCapacity> Capacities { get; }
    }
}
