# Product catalog (V1)

Status: Draft — **every availability state below is ⏳ owner validation** ([owner-validation](owner-validation.md) OV-1)
PRD links: 1.1, 1.3, 3.2
Purpose: The V1 list of products, categories, and industries, with the stable slugs the site and API share.

## Rules

1. The machine-readable source is [`catalog/products.json`](../../catalog/products.json) at the repository root. The site renders from it and the API validates inquiry products against it ([ADR 0002](../01-architecture/adr/0002-static-catalog-v1.md)). This table must match that file.
2. **A slug never changes** once published: inquiries and demand reports reference it. Renaming a product changes its name only.
3. Marketing copy (features, modules, FAQ) lives in the site's content files, keyed by slug. It is AI-drafted and needs owner review (OV-2).
4. **Brochures:** a product shows "Download brochure" only when its catalog entry has `"brochure": "<file>.pdf"` and the file exists in `web/apps/site/public/brochures/`. A test fails if a listed brochure file is missing. PDFs come from the owner (OV-16); until then no product lists a brochure.

## Categories

| Slug | Name |
|---|---|
| `business-management` | Business Management |
| `sales-commerce` | Sales & Commerce |
| `finance-hr` | Finance & HR |
| `education` | Education |
| `healthcare` | Healthcare |

## Industries

| Slug | Name |
|---|---|
| `retail` | Retail & Wholesale |
| `manufacturing` | Manufacturing |
| `education` | Education |
| `healthcare` | Healthcare |
| `hospitality` | Hospitality & Restaurants |
| `real-estate` | Real Estate |
| `logistics` | Logistics & Distribution |
| `professional-services` | Professional Services |
| `ngo` | NGOs & Non-profits |

## Products

| Slug | Name | Category | Availability ⏳ | Main industries |
|---|---|---|---|---|
| `erp` | InflexHub ERP | business-management | custom | manufacturing, retail, logistics |
| `pos` | InflexHub POS | sales-commerce | available | retail, hospitality |
| `inventory` | Inventory Management | business-management | available | retail, manufacturing, logistics |
| `accounting` | Accounting Software | finance-hr | available | retail, professional-services, ngo |
| `hrm-payroll` | HRM & Payroll | finance-hr | available | manufacturing, professional-services, ngo |
| `crm` | CRM System | sales-commerce | custom | professional-services, real-estate, retail |
| `ecommerce` | E-commerce Solution | sales-commerce | custom | retail |
| `school-management` | School Management System | education | available | education |
| `college-university` | College & University Management | education | custom | education |
| `lms` | Learning Management System | education | upcoming | education, professional-services |
| `hospital-management` | Hospital Management System | healthcare | custom | healthcare |
| `pharmacy-management` | Pharmacy Management | healthcare | upcoming | healthcare, retail |
| `diagnostic-lab` | Diagnostic & Lab Management | healthcare | upcoming | healthcare |
| `restaurant-management` | Restaurant Management | sales-commerce | upcoming | hospitality |
| `property-management` | Real Estate & Property Management | business-management | upcoming | real-estate |

Count: 15 products — 5 available, 5 custom, 5 upcoming (placeholder split until OV-1 is answered).
