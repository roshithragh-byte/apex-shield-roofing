export interface RoofingCompanyConfig {
  whop: {
    companyId: string;
    appId?: string;
    sandbox?: boolean;
    publishableKey?: string;
  };
  company: {
    name: string;
    shortName: string;
    tagline: string;
    phone: string;
    formattedPhone: string;
    email: string;
    licenseNumber: string;
    yearsInBusiness: number;
    rating: number;
    reviewCount: number;
    emergencyAvailable: boolean;
    emergencyDispatchHours: string;
  };
  serviceArea: {
    primaryCity: string;
    state: string;
    coveredZipCodes: string[];
    metroDescription: string;
  };
  plans: {
    inspection: {
      id: string;
      name: string;
      price: number;
      tagline: string;
      description: string;
      features: string[];
      depositOnly?: boolean;
    };
    deposit: {
      id: string;
      name: string;
      price: number;
      tagline: string;
      description: string;
      features: string[];
      depositOnly: boolean;
    };
    flatRateService: {
      id: string;
      name: string;
      price: number;
      tagline: string;
      description: string;
      features: string[];
      depositOnly?: boolean;
    };
  };
  financing: {
    minMonthlyPayment: number;
    supportedProviders: string[];
    termDescription: string;
  };
  trustBadges: {
    name: string;
    description: string;
  }[];
}

export const roofingConfig: RoofingCompanyConfig = {
  whop: {
    companyId: "biz_3hYjQ8xK9LmP2W",
    appId: "app_apexroofing_template",
    sandbox: true,
    publishableKey: "pk_test_whop_roofing_live_demo",
  },
  company: {
    name: "Apex Shield Roofing & Restoration",
    shortName: "Apex Shield",
    tagline: "Austin's Premier Residential & Commercial High-Ticket Roofing",
    phone: "tel:5125557663",
    formattedPhone: "(512) 555-ROOF",
    email: "dispatch@apexshieldroofing.com",
    licenseNumber: "TX-RCL #882194-A",
    yearsInBusiness: 18,
    rating: 4.98,
    reviewCount: 342,
    emergencyAvailable: true,
    emergencyDispatchHours: "24/7 Rapid Emergency Dispatch within 60 mins",
  },
  serviceArea: {
    primaryCity: "Austin",
    state: "TX",
    coveredZipCodes: [
      "78701", "78702", "78703", "78704", "78705",
      "78745", "78746", "78748", "78749", "78750",
      "78758", "78759", "78613", "78660", "78681"
    ],
    metroDescription: "Serving Greater Austin, Westlake Hills, Lakeway, Round Rock, & Cedar Park",
  },
  plans: {
    inspection: {
      id: "plan_insp_149",
      name: "32-Point Drone & Hazard Inspection",
      price: 149,
      tagline: "Comprehensive Diagnostic & Insurance Report",
      description: "High-resolution 4K aerial drone scan, attic moisture audit, and written estimate accepted by all major insurance adjusters.",
      features: [
        "4K Drone aerial thermal roof scan",
        "32-point structural hazard & hail audit",
        "Attic moisture & ventilation inspection",
        "Certified insurance claim readiness report",
        "$149 credited 100% toward any approved repair"
      ]
    },
    deposit: {
      id: "plan_dep_500",
      name: "Project Commitment & Crew Slot Deposit",
      price: 500,
      tagline: "Lock In Production Schedule & Material Order",
      description: "Secures dedicated installation crew slot and factory material orders. Stores card on file for hassle-free post-walkthrough balance settlement.",
      depositOnly: true,
      features: [
        "Guaranteed 5-day tear-off & installation window",
        "Direct manufacturer material order allocation",
        "Dedicated on-site project foreman assigned",
        "Card-on-file setup for seamless final invoicing",
        "100% deductible from final balance upon sign-off"
      ]
    },
    flatRateService: {
      id: "plan_flat_2499",
      name: "Emergency Leak Stop & Flashing Seal",
      price: 2499,
      tagline: "Guaranteed Water-Tight Same-Week Fix",
      description: "Comprehensive repair for active leaks, chimney flashing rebuilds, damaged valleys, and up to 2 square shingle replacement with 5-year warranty.",
      features: [
        "Immediate same-week emergency crew dispatch",
        "Full chimney, skylight & pipe boot flashing replacement",
        "Ice & water shield barrier installed at leak source",
        "Up to 2 squares (200 sq ft) architectural shingle patch",
        "5-Year No-Leak Apex Craftsmanship Warranty"
      ]
    }
  },
  financing: {
    minMonthlyPayment: 89,
    supportedProviders: ["Klarna", "Splitit", "Afterpay", "Affirm"],
    termDescription: "0% APR promotions available for 12 months on approved credit. Powered by Whop Payments."
  },
  trustBadges: [
    {
      name: "GAF Master Elite® Certified",
      description: "Top 2% of roofers in North America with lifetime GAF Golden Pledge warranty eligibility."
    },
    {
      name: "BBB A+ Accredited",
      description: "Zero unresolved complaints over 18 years of continuous Central Texas operations."
    },
    {
      name: "$2,000,000 Liability Insured",
      description: "Full worker's compensation and general commercial liability coverage on every residential job."
    },
    {
      name: "25-Year Workmanship Guarantee",
      description: "Backed by transferable warranty certificates delivered upon final invoice signoff."
    }
  ]
};
