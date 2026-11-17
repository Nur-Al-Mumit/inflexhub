# User stories

Status: Draft
PRD links: 3
Purpose: Acceptance criteria for every V1 story in Gherkin.

## Conventions

- Tags: `@v1`, `@v1.1`, `@v2` = version. `@ui` = verified by a manual or browser check, not a unit test. `@open` = blocked on an owner decision; never implemented.
- Every non-`@ui` scenario maps to a test named `Method_Scenario_ExpectedResult` and listed in the [tracker](tracker.md).

---

## US-1 Understand InflexHub at a glance `@v1 @ui`

As a business decision maker, I want to understand what InflexHub offers within seconds, so that I decide whether to explore further.

```gherkin
Scenario: Home page shows the offer
  Given I open the home page
  Then I see a headline stating what InflexHub does
  And I see a "Explore products" and a "Request a demo" action above the fold
  And I see product highlights for every category
  And I see the industries InflexHub serves

Scenario: Navigation on a phone
  Given my screen is 360 px wide
  When I open the menu
  Then a drawer shows all main pages and traps focus until I close it with Escape or the close button
```

## US-2 Browse and filter products `@v1`

```gherkin
Scenario: Filter by availability
  Given I am on the products page
  When I choose "Coming soon"
  Then I see only products whose availability is "upcoming"
  And the URL contains "availability=upcoming"

Scenario: Combine filters and search
  Given I choose category "Education" and type "school"
  Then I see "School Management System" only

Scenario: No result
  Given my filters match no product
  Then I see an empty state with a "Clear filters" action and a link to custom software

Scenario: Filters survive reload
  Given the URL is "/products?category=healthcare"
  When the page loads
  Then the "Healthcare" filter is selected
```

## US-3 Understand one product `@v1 @ui`

```gherkin
Scenario Outline: Actions follow availability
  Given product "<slug>" has availability "<availability>"
  When I open its page
  Then the primary action is "<primary>"

  Examples:
    | slug          | availability | primary                    |
    | pos           | available    | Request a demo             |
    | erp           | custom       | Request custom development |
    | lms           | upcoming     | Register interest          |

Scenario: Unknown product
  When I open "/products/does-not-exist"
  Then I see the 404 page with a link to all products
```

## US-4 Find solutions for my industry `@v1 @ui`

```gherkin
Scenario: Industry page lists matching products
  When I open "/industries/healthcare"
  Then I see the healthcare challenges section
  And I see every product whose industries include "healthcare"
```

## US-5 Request a demo `@v1`

```gherkin
Scenario: Valid demo request is stored
  Given product "pos" is available
  When I submit name, work email, phone, company, product "pos", and accept the privacy policy
  Then one inquiry of type "demo" is stored with status "new"
  And it stores the product name, category, and availability at submission
  And I see a reference in the format "IH-YYMM-XXXXX"

Scenario: Demo for a product that is not available
  When I submit a demo request for product "lms"
  Then I get a 422 with slug "product-not-eligible"

Scenario: Product pre-selected from the URL
  Given I came from "/request-demo?product=pos"
  Then the product field shows "InflexHub POS"
```

## US-6 Request a quotation `@v1`

```gherkin
Scenario: Quotation for several products
  When I submit a quotation for products "pos" and "inventory" with user count 25
  Then one inquiry of type "quote" is stored with two inquiry products

Scenario: Quotation needs at least one product
  When I submit a quotation without products
  Then I get a 400 with a field error on "productSlugs"

Scenario: Quotation for an upcoming product
  When I submit a quotation for "lms"
  Then I get a 422 with slug "product-not-eligible"
```

## US-7 Submit custom software requirements `@v1`

```gherkin
Scenario: Custom requirements stored
  When I submit a project summary of at least 30 characters, my industry, budget range, and timeline
  Then one inquiry of type "custom_software" is stored

Scenario: Summary too short
  When the project summary has 12 characters
  Then I get a 400 with a field error on "message"
```

## US-8 Contact the company `@v1`

```gherkin
Scenario: Contact message stored
  When I submit name, email, subject, message and accept the privacy policy
  Then one inquiry of type "contact" is stored
```

## US-9 Register interest in an upcoming product `@v1`

```gherkin
Scenario: Interest registered
  Given product "lms" is upcoming
  When I submit my name and email for "lms"
  Then one inquiry of type "product_interest" is stored and I get 201

Scenario: Same interest twice does not double count (BR-3)
  Given I already registered interest in "lms" with "a@b.com"
  When I register again with "A@B.com"
  Then no new inquiry is stored
  And I get 200 with the first reference

Scenario: Interest in an available product
  When I register interest in "pos"
  Then I get a 422 with slug "product-not-eligible"
```

## US-10 Learn about the company `@v1 @ui`

About, contact details, privacy, and terms pages exist and are linked from the footer.

## US-11 Be found in search engines `@v1`

```gherkin
Scenario: Sitemap lists every public page
  When I request "/sitemap.xml"
  Then it lists every static page, every product, and every industry

Scenario: Product structured data
  When I open a product page
  Then it contains JSON-LD of type "SoftwareApplication" with the product name
```

## US-13 Download a product brochure `@v1`

```gherkin
Scenario: Brochure button only when a brochure exists
  Given product "pos" has brochure "pos.pdf" and product "erp" has none
  Then the "pos" page shows "Download brochure" and the "erp" page does not

Scenario: Brochure download stored and link returned
  When I submit my name and email to download the "pos" brochure
  Then one inquiry of type "brochure_download" is stored
  And the response contains downloadUrl "/brochures/pos.pdf"
  And the download starts and a link is shown

Scenario: Same brochure again does not double count (BR-3)
  Given I already downloaded the "pos" brochure with "a@b.com"
  When I download it again with "a@b.com"
  Then no new inquiry is stored and I get 200 with the first reference and the link

Scenario: Product without a brochure
  When I request the brochure for "erp"
  Then I get a 422 with slug "product-not-eligible"

Scenario: Listed brochure file exists
  Given the catalog lists a brochure for a product
  Then the file exists in "public/brochures/"
```

## US-14 Apply to become a partner `@v1`

```gherkin
Scenario: Partner application stored
  Given I am on "/partners"
  When I submit name, email, phone, company, country "BD", partner type "reseller", region "Chattogram", and products "pos" and "inventory"
  Then one inquiry of type "partner" is stored with partner type "reseller" and two inquiry products

Scenario: Partner type required
  When I submit a partner application without a partner type
  Then I get a 400 with a field error on "partnerType"
```

## US-15 Sales team learns about every new inquiry `@v1`

```gherkin
Scenario: Notification queued after saving (BR-11)
  Given email is enabled
  When any inquiry is stored
  Then exactly one sales notification is queued with the inquiry reference
  And the visitor's response does not wait for the email

Scenario: No notification for honeypot hits or duplicates
  When a honeypot submission or a BR-3 duplicate arrives
  Then no notification is queued

Scenario: Email disabled
  Given email is not configured
  When an inquiry is stored
  Then it is saved with sales_notified_at null and the visitor sees success

Scenario: Sending fails
  Given the SMTP server rejects the message
  Then it is retried 3 times and the failure is logged with the reference only
```

## US-16 Export inquiries before the admin panel exists `@v1`

```gherkin
Scenario: Export a date range (BR-12)
  Given inquiries exist on 2026-11-05 and 2026-12-02
  When I call the export with from "2026-11-01" to "2026-11-30" and the correct admin key
  Then I get a CSV with a UTF-8 BOM containing only the 2026-11-05 inquiry

Scenario: CSV injection neutralised
  Given an inquiry message starts with "=HYPERLINK("
  Then the exported cell starts with "'="

Scenario: Wrong key
  When I call the export with a wrong admin key
  Then I get 401 with slug "admin-key-invalid"

Scenario: Export not configured
  Given no admin export key is configured
  When I call the export
  Then I get 404
```

## US-17 Meet international web standards `@v1`

```gherkin
Scenario: Canonical URL
  When I open "/products/pos?utm_source=x"
  Then the page has a canonical link "https://<site>/products/pos"

Scenario: Security headers
  When I request any page
  Then the response has Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame-ancestors 'none'

Scenario: Security contact
  When I request "/.well-known/security.txt"
  Then it contains "Contact:" and an "Expires:" date in the future

Scenario: Automated accessibility
  When the accessibility test suite runs against the key pages
  Then it reports no serious or critical violations

Scenario: Trace id end to end
  Given the API returns an error
  Then the ProblemDetails traceId matches the trace in the site and API logs
```

## US-12 Protect and measure submissions `@v1`

```gherkin
Scenario: Honeypot filled (BR-5)
  When a submission has the hidden "website" field filled
  Then the API answers 201 with a reference
  And nothing is stored

Scenario: Rate limit (BR-4)
  Given a client IP sent 5 submissions in the last 10 minutes
  When it sends another
  Then it gets 429 with slug "rate-limited" and a Retry-After header

Scenario: Consent required (BR-6)
  When a submission has "consent" false
  Then I get a 400 with a field error on "consent"

Scenario: Source captured
  Given I arrived with "utm_source=facebook&utm_campaign=launch"
  When I submit any form
  Then the inquiry stores utm source "facebook", campaign "launch", and the page path

Scenario: Bangladesh phone normalised (BR-10)
  When I submit phone "01711-000000" with no country
  Then the inquiry stores phone "+8801711000000" and country "BD"

Scenario: International phone accepted (BR-10)
  When I submit phone "+44 20 7946 0000" with country "GB"
  Then the inquiry stores phone "+442079460000" and country "GB"

Scenario: Invalid phone
  When I submit phone "12345"
  Then I get a 400 with a field error on "phone"

Scenario: Unique reference (BR-1)
  When a generated reference already exists
  Then a new one is generated before saving
```
