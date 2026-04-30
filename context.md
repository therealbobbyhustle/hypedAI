PROJECT CONTEXT DOC: HYPED MVP + MARKETPLACE ROADMAP

Project Name:
HYPED

Prototype Reference:
https://indie-route-planner.vercel.app/

Core Product:
HYPED is an indie artist promo route planner that helps independent musicians and performing artists turn streaming listener data into real-world promo routes.

Artists connect their Spotify for Artists and Apple Music for Artists accounts. The app pulls listener data by city/region, visualizes demand on a heat map, ranks strongest markets, and generates a smart promo route based on audience demand, travel efficiency, budget, and campaign goals.

Long-Term Vision:
HYPED starts as an indie artist route planner, but the larger company vision is to become the market activation operating system for independent artists, managers, brands, promoters, influencers, and local ambassadors.

The route planner is the wedge product. It gives artists immediate utility, builds trust, creates a user base, and collects valuable market demand data. Over time, this data powers a marketplace for local promo teams, brand ambassadors, vendors, sponsors, financing, booking support, and real-world fan activation.

Main Positioning:
HYPED helps indie artists turn streaming fans into real-world momentum.

Alternate Positioning:
Find your next cities. Build smarter promo runs.
Turn listener data into real-world growth.
Your fans are already showing you where to go next.

Core MVP Product Loop:
Connect artist data
Discover strongest markets
Build a smart promo route
Save and share the plan

Core Emotional User Journey:
1. “I did not know I had fans there.”
2. “Now I know where I should go.”
3. “This app gave me a real plan.”
4. “I can send this to my team.”
5. “I need to come back when I plan my next release.”

MVP Goal:
The MVP should make an indie artist say:
“Damn, this is useful.”

The MVP must stay focused. Do not build marketplace, messaging, ticket sales, merch, or complex CRM yet. The first product must solve one painful problem very well:
“Where should I go next, and how do I turn my streaming audience into a real-world promo route?”

BEST MVP FEATURES

1. Landing / Welcome Screen

Purpose:
Introduce the product clearly and get the artist into the core loop fast.

Main Message:
Turn streaming fans into real-world momentum.

Supporting Copy:
Connect your artist data, discover your strongest cities, and build smarter promo routes around where your fans already are.

Primary CTA:
Start Planning My Route

Secondary CTA:
View Demo Data

Design Direction:
Premium dark UI, music-tech startup feel, clean, mobile-first, investor-demo polish.

The welcome screen should make the product obvious within 10 seconds.

2. Onboarding / Artist Setup

Purpose:
Collect the minimum artist information needed to personalize the app before mock platform connection.

Fields:
Artist name
Genre
Home city
Optional artist image/avatar
Optional campaign goal

Campaign goal examples:
Promo Run
Small Venue Run
Release Rollout
College Market Run
Content + Networking Run

UX Rule:
Do not make onboarding feel long. Keep it quick and exciting.

Suggested microcopy:
“Let’s find the cities where your fans are already waiting.”

3. Mock Platform Connection

Purpose:
Simulate connecting Spotify for Artists and Apple Music for Artists. Real API integrations can be added later.

Required connection cards:
Spotify for Artists
Apple Music for Artists

Flow:
User clicks Connect Spotify
Show loading state
Mark Spotify connected
User clicks Connect Apple Music
Show loading state
Mark Apple Music connected
Continue to dashboard

Important:
For MVP, use mock data only. Structure code so real APIs can be plugged in later.

Mock Data Should Include:
Artist name
Genre
Home city
Monthly listeners
Follower count
Streaming growth
Platform split
Top cities
Top songs
Listener counts by market
Growth by city
City opportunity scores

Suggested connected-state message:
“Your data is synced. We found hidden demand in 7 cities.”

4. Dashboard / Home Command Center

Purpose:
The dashboard is the artist’s command center. It should immediately show where demand exists and what action to take next.

Dashboard Must Show:
Artist profile card
Total monthly listeners
Follower count
Platform split
Top market count
Saved routes count
Saved cities count
Monthly growth indicator
Quick action cards
Top 5 strongest cities
CTA to build first route
CTA to view heat map

Important First-Login Message:
“Your fans are already showing you where to go next.”

Primary CTA:
Build Your First Promo Route

Quick Action Cards:
Build Route
View Heat Map
Explore Cities
Export Plan

Top Markets Section:
Show the top 5 cities by listener count/opportunity score.

Each city card should show:
City, state
Listener count
Growth percentage
Opportunity score
Save button
View details button

Dashboard Psychology:
The dashboard should not feel like generic analytics. It should feel like a decision engine.
The user should immediately understand:
Where they are strongest
Which cities are growing
What they should do next

5. Fan Heat Map / Market Map

Purpose:
Create the first “wow” moment by visually showing the artist where fans are located.

MVP Approach:
If a real map library is already available, use it.
If not, create a stylized US map or map-style card visualization with city hotspots.

Heat Map Must Show:
City markers
Listener count by city
Color or size intensity based on demand
City ranking sidebar
Click/tap city to open city detail
Filters

Filters:
All Platforms
Spotify
Apple Music
Growth Markets
Top Listener Markets

Example Cities:
Atlanta, GA
Nashville, TN
Dallas, TX
Houston, TX
Charlotte, NC
St. Louis, MO
Memphis, TN
New Orleans, LA
Chicago, IL
Miami, FL
Kansas City, MO
Tampa, FL
Birmingham, AL
Raleigh, NC

City Marker Logic:
Larger listener count equals larger marker.
Higher growth equals visual highlight.
High opportunity markets should be visually distinct.

User Experience:
The map should create the feeling:
“I have real fans in places I did not expect.”

6. Smart Route Builder

Purpose:
This is the hero feature of the MVP. It turns listener data into a real action plan.

User Inputs:
Starting city
Number of days
Max driving distance per day
Budget level
Campaign goal
Optional preferred region

Budget Levels:
Low
Medium
High

Campaign Goals:
Promo Run
Small Venue Run
Release Rollout
College Market Run
Content + Networking Run

Generate Route Button:
“Generate Smart Route”

Route Builder Logic:
Use mock data and simple scoring.

Factors:
Listener count
Listener growth rate
Market opportunity score
Distance from starting city
Route efficiency
Budget fit
Goal fit
Regional clustering

Output Should Show:
Recommended city sequence
Total listener reach
Estimated total miles
Estimated drive time
Estimated cost
Route opportunity score
Each stop as a card
Reason each city was selected
Suggested activation for each city

Example Route:
Atlanta → Charlotte → Nashville → Memphis → St. Louis

Route Summary Card:
Route title
Number of cities
Total listener reach
Estimated miles
Estimated cost
Opportunity score
Recommended next action

Route Stop Card Must Include:
City, state
Listener count
Growth percentage
Opportunity score
Suggested activation
Estimated stop value
Reason selected
Save city button
Add notes button
View city details button

Suggested Activations:
Venue outreach
College promo
Radio/blog outreach
Content shoot
Street promo
Networking night
Influencer collab
Open mic appearance
Pop-up performance

Example City Reason:
“Nashville was selected because it has strong listener growth, nearby venue opportunities, and fits efficiently between Atlanta and Memphis.”

7. Route Detail / Saved Route Page

Purpose:
Let the user revisit a generated route and use it as a planning document.

Route Detail Should Show:
Route title
Artist name
Starting city
Route cities in order
Total listener reach
Estimated miles
Estimated drive time
Estimated cost
Opportunity score
Budget level
Campaign goal
Created date
Route notes
City stop cards
Recommended next actions

Recommended Next Actions:
Research venues in top 2 cities
Contact local radio/blogs
Plan content shoots
Save high-potential cities
Export route plan

Future Marketplace Preview:
This page can eventually include marketplace prompts like:
“Need promo teams in Nashville?”
But for MVP, keep this as a locked Coming Soon preview only if used at all.

8. City Opportunity Page / City Detail Panel

Purpose:
Turn each city into a clear market opportunity.

City Detail Must Show:
City, state
Listener count
Growth trend
Platform split
Top songs in that market
Market opportunity score
Estimated stop value
Nearby cities worth bundling
Promo targets
Notes
Saved status

Audience Section:
Total listeners
Spotify listeners
Apple Music listeners
Growth percentage
Top songs

Promo Targets Section:
Suggested venues
Radio stations
College stations
Local events
Promo opportunities
Content/vendor suggestions

Venue Data Example:
The Basement East, Nashville
Smith’s Olde Bar, Atlanta
Neighborhood Theatre, Charlotte
Off Broadway, St. Louis

Radio/College Examples:
College radio station
Local hip-hop/R&B show
Community station
Campus media outlet

Local Events Examples:
Open mic night
Indie showcase
College homecoming week
Local festival
Nightlife event

Vendor/Content Examples:
Photographer
Videographer
Local content creator
Street promo vendor
DJ/host

Notes Section:
Allow user to add/edit notes for that city.

Saved Status:
Hot Market
Researching
Book Soon
Revisit Later

9. Saved Cities + Notes

Purpose:
Create light retention without overbuilding a full CRM.

User Can:
Save a city
Add notes
Edit notes
Change saved status
Remove from saved list
Open city detail

Statuses:
Hot Market
Researching
Book Soon
Revisit Later

Saved City Card Should Show:
City, state
Listener count
Growth
Opportunity score
Current status
Last updated
Notes preview

Use Case:
“Nashville is a hot market. Need promoter.”
“Houston growing fast. Revisit after next single.”
“Charlotte good college market.”

10. Export / Share Route Plan

Purpose:
Create a viral and practical output the artist can send to managers, team members, promoters, investors, or booking contacts.

MVP Export Features:
Saved route summary view
Shareable route preview card
Download PDF button placeholder
Copy Share Link button placeholder
Screenshot Mode button placeholder

Do not build real PDF export unless it is easy. Placeholders are acceptable for MVP, but the screen should look polished.

Export View Should Look Like:
A clean mini tour deck.

Export Should Include:
Artist name
Route title
Route cities
Total listener reach
Estimated cost
Opportunity score
Top city insights
Route map/sequence
Recommended next actions

Placeholder Toasts:
“Share link copied”
“PDF export coming soon”
“Screenshot mode enabled”

Reason This Matters:
Artists will share the plan with their team. This creates organic distribution.

11. Profile / Settings

Purpose:
Simple account and app settings.

Profile Should Show:
Artist profile
Genre
Home city
Connected platforms
Subscription status placeholder
Saved route count
Saved city count

Settings:
Edit artist profile
Manage connected platforms
Coming Soon features
Logout button if auth exists

Coming Soon Section:
AI Tour Manager
Brand Ambassador Marketplace
Sponsor Matching
Street Team Activation
Label/Manager Dashboard

Keep Coming Soon subtle. Do not distract from the MVP.

12. Navigation

Mobile Navigation:
Bottom tabs

Tabs:
Home
Map
Routes
Cities
Profile

Desktop Navigation:
Sidebar navigation

Navigation Rule:
The app should feel simple enough for an artist to use with one hand on a phone.

13. Mock Data Structure

Create clear mock data files so APIs can be added later.

Suggested Data Models:

Artist:
id
name
genre
homeCity
imageUrl
monthlyListeners
followers
growthRate
platformsConnected

PlatformStats:
spotifyListeners
appleMusicListeners
spotifyConnected
appleMusicConnected
platformSplit

CityMarket:
id
city
state
lat
lng
listenerCount
growthRate
platformSplit
topSongs
opportunityScore
estimatedStopValue
nearbyCities
venues
radioStations
events
vendors
notes
savedStatus

RoutePlan:
id
title
startCity
days
budgetLevel
goal
cities
totalListeners
totalMiles
estimatedDriveTime
estimatedCost
opportunityScore
createdAt
notes

SavedCity:
cityId
status
notes
createdAt
updatedAt

Venue:
id
name
city
state
type
capacity
contactPlaceholder
notes

PromoTarget:
id
name
type
city
state
description
contactPlaceholder

14. Route Scoring Helpers

Create utility functions so logic is modular.

Functions:
calculateOpportunityScore
estimateRouteCost
estimateDriveTime
rankCitiesForRoute
generateRecommendedRoute
calculateTotalListenerReach
calculateRouteEfficiency
getGoalFitScore
getBudgetFitEstimate

Simple Route Formula:
Opportunity Score =
listener score
+ growth score
+ market opportunity score
+ goal fit score
+ route efficiency score
- distance penalty

Budget Cost Estimates:
Low budget:
Lower hotel/food/promo estimate

Medium budget:
Moderate travel/promo estimate

High budget:
Higher travel/promo/content estimate

Estimated Stop Value:
Mock calculation using listener count, growth, and market score.
This does not need to be financially exact. It should feel useful and directional.

15. UI Components To Build

Recommended Components:
AppShell
SidebarNav
MobileBottomNav
StatCard
ArtistProfileCard
PlatformConnectionCard
TopMarketsList
CityMarketCard
HeatMapView
CityDetailPanel
RouteBuilderForm
RouteResultCard
RouteStopCard
OpportunityScoreBadge
SavedCityNotes
ExportRouteModal
EmptyState
LoadingState
ConnectedPlatformBadge
MarketFilterTabs
RouteSummaryCard
ComingSoonCard

16. Design Direction

Visual Style:
Premium dark UI
Music-tech command center
Neon accent colors, but not childish
Clean cards
Rounded corners
Smooth transitions
Investor-demo polish
Mobile-first
Responsive desktop layout

Design Inspiration:
Spotify analytics
Apple Music for Artists
Carta-style clean dashboards
Uber/DoorDash command flow
Nightlife/music industry energy

Important UX Rules:
Avoid clutter.
Every screen should answer:
“What should the artist do next?”

Use clear CTAs.
Use strong empty states.
Use polished loading states.
Use realistic data.
Make the product story clear within 60 seconds.

17. MVP Acceptance Criteria

The MVP is successful when:
A user can complete onboarding
A user can simulate connecting Spotify and Apple Music
A user can see their top markets
A user can view a heat map or city demand visualization
A user can generate a smart route
A user can open city detail pages
A user can save cities
A user can add/edit notes
A user can view a saved route
A user can preview/share/export a route summary
The app works on mobile and desktop
The UI looks premium and polished
The mock data feels realistic
The product story is clear within 60 seconds

18. What Not To Build In MVP

Do not build these yet:
Brand ambassador marketplace
Messaging
Social feed
Real payment system
Ticket sales
Merch store
Hotel booking
Full CRM
AI outreach email generator
Real API integrations unless already easy
Complex team collaboration
Live booking engine
Fan app
Sponsor marketplace
Financing
Vendor payments

The MVP must stay focused on:
Connect data
See demand
Build route
Save/share plan

MARKETPLACE ROADMAP

Marketplace Vision:
After HYPED builds a user base through indie artist route planning, it expands into a marketplace for real-world market activation.

The marketplace lets artists, brands, influencers, promoters, clubs, festivals, and local businesses hire local ambassadors, street teams, vendors, creators, and event support in specific cities.

This is like DoorDash or Uber for grassroots promotion and local brand activation.

The route planner creates demand:
An artist builds a route and discovers Nashville, Charlotte, and Atlanta are hot markets.

The marketplace captures that demand:
The app asks:
“Need promo teams in Nashville?”
“Need a photographer in Charlotte?”
“Need a street team in Atlanta?”

This creates the transition from SaaS to marketplace.

Marketplace Positioning:
The on-demand workforce for music, nightlife, creator, and experiential marketing.

Alternate Marketplace Positioning:
Book trusted local promo help in every city.
Turn market demand into real-world activation.
Find the people you need before you hit the city.

Marketplace Sides:

Demand Side:
Artists
Managers
Labels
Promoters
Venues
Nightclubs
Festivals
Clothing brands
Beverage brands
Influencers
Local businesses
Agencies
Event organizers

Supply Side:
Brand ambassadors
Street team reps
Promo reps
Models
Event hosts
Influencers
Photographers
Videographers
DJs
Local creators
Flyer teams
Campus reps
Merch sellers
Content assistants
Team leads

Marketplace Use Cases:

Artist Touring Nashville:
Needs 3 promo reps, 1 photographer, 1 DJ host, and 2 people flyering campuses.

Beverage Brand Launching In Kansas City:
Needs 10 sampling reps, 2 content creators, and a recap videographer.

Clothing Brand Pop-Up:
Needs models, line management, content creators, and street promo.

Club Promoter:
Needs local ambassadors to promote an event and drive attendance.

Indie Artist:
Needs flyers passed out before a show, social content captured, and email/SMS fan signups collected.

Festival:
Needs local staff, check-in helpers, content shooters, and brand ambassadors.

Marketplace Phase 1: Lightweight Gig Board

Goal:
Test marketplace demand without overbuilding.

Features:
Post a gig
Browse available gigs
Apply to gig
Accept worker
Basic profile
Basic worker verification
Manual payment workflow or placeholder
Ratings placeholder
Proof of work upload placeholder

Buyer Gig Fields:
City
Date
Start time
End time
Task type
Number of people needed
Pay rate
Campaign description
Attire requirements
Location
Urgency
Proof requirements
Contact info placeholder

Worker Profile Fields:
Name
City
Profile photo
Bio
Skills
Social links
Experience tags
Availability
Rating placeholder
Verification status placeholder

Task Types:
Flyer distribution
Street promo
Event staffing
Brand ambassador
Campus promo
Content capture
Photography
Videography
DJ/host support
Merch table support
Lead capture
Sampling event
Pop-up support

Proof of Work:
Check-in photo
Event photos
Short video clips
Lead count
Flyer distribution confirmation
Manager approval
GPS/check-in placeholder

Marketplace Phase 2: Managed Local Promo Teams

Goal:
Improve trust and fulfillment.

Features:
Verified workers
Team leads
City-based promo squads
Buyer reviews
Worker reviews
Escrow payments
Dispute workflow
Proof of work requirements
Campaign recap reports
Repeat booking
Preferred workers
In-app messaging

Trust Features:
ID verification
Selfie verification
Social verification
Portfolio review
Ratings
Completion rate
On-time score
Buyer feedback
Worker reliability score

Campaign Recap:
Number of reps
Hours worked
Photos delivered
Videos delivered
Leads collected
Flyers distributed
Estimated reach
Notes from team lead

Marketplace Phase 3: Full Market Activation Marketplace

Goal:
Become the operating system for local promo execution.

Features:
Instant booking
Worker availability calendar
City-specific vendor directory
Auto-matching
Smart pricing
Campaign templates
Multi-city staffing
Route-based staffing
Geo-targeted promo packages
Brand campaign dashboards
Real-time check-ins
Automated recap reports
Payments and payouts
Worker tax documents
Enterprise accounts

Buyer Can Book:
Street teams
Brand ambassadors
Photographers
Videographers
Influencers
DJs
Event hosts
Campus reps
Promo managers
Local vendors

Marketplace Phase 4: Brand + Sponsor Marketplace

Goal:
Connect artists and creators with brands looking for local influence.

Features:
Sponsor matching
Artist/brand fit score
City-based sponsor opportunities
Campaign proposals
Brand briefs
Influencer deliverables
Content usage rights
Performance reporting
Brand ambassador bundles

Sponsor Categories:
Clothing brands
Beverage brands
Lifestyle brands
Local businesses
Tech brands
Fitness brands
Beauty brands
Food brands
Cannabis brands where legal
Nightlife brands
Festival sponsors

Artist Sponsor Profile:
Markets with strongest fanbase
Audience size
Genre
Engagement
Route plans
Content examples
Past activation results
Brand safety indicators

Marketplace Phase 5: Financing + Growth Capital

Goal:
Use artist demand data and route projections to power financing.

Products:
Promo budget advance
Tour gas advance
Merch production advance
Content campaign advance
Release rollout financing

Inputs:
Streaming data
Market growth
Route opportunity score
Past route performance
Projected ticket/merch value
Fan engagement
Social growth

Outputs:
Suggested advance amount
Risk score
Projected ROI
Payback structure

Important:
This should come later after enough data exists. Do not build this in MVP.

Marketplace Phase 6: B2B Label / Manager Dashboard

Goal:
Let managers, labels, agencies, and teams manage multiple artists.

Features:
Multi-artist dashboard
Compare market demand across artists
Route planning by roster
Tour calendar
City opportunity map
Team collaboration
Export reports
Marketplace staffing for multiple cities
Sponsor matching by artist
Campaign performance tracking

Target Customers:
Managers
Indie labels
Marketing agencies
Booking teams
Promoters
Talent development companies

Marketplace Phase 7: Fan Activation Layer

Goal:
Turn real-world tours into measurable fan growth.

Features:
Fan check-ins
Fan passport
Loyalty badges
VIP unlocks
Meet and greet rewards
Merch discounts
SMS/email fan capture
Geo-targeted fan alerts
Pre-save campaigns
Ticket retargeting
Fan city leaderboard

Use Case:
Fans check in at shows or pop-ups and earn rewards. Artists build owned fan data city by city.

FUTURE AI FEATURES

1. AI Tour Manager

An assistant that helps artists plan and execute campaigns.

Example Prompts:
“Where should I tour in July?”
“Build a $2,000 promo run.”
“Who should I contact in Dallas first?”
“Rewrite my venue pitch email.”
“Which city should I skip?”
“What should I do in Nashville before the show?”

2. Ticket Demand Predictor

Predicts likely ticket demand based on:
Streaming growth
Listener count
Social engagement
Past attendance
Similar artist performance
City opportunity score

Outputs:
Can sell 50 tickets in Nashville
Too early for Atlanta
Memphis ready in 60 days
Houston needs more promo first

3. Dynamic Route Replanner

Adjusts route based on new data.

Example:
“Skip Memphis and add Louisville. Better route efficiency and stronger growth.”

4. Release Rollout Planner

For a new single or album, the app builds:
City-by-city promo plan
Radio/blog targets
Influencer pushes
Release events
Content shoots
Street promo strategy

5. AI Outreach Assistant

Future feature, not MVP.

Helps generate:
Venue emails
Promoter DMs
Radio pitches
Sponsor proposals
Influencer outreach
Street team briefs

6. Artist Credit Score

Not financial credit.

Measures:
Audience consistency
Engagement
Market demand
Growth momentum
Route ROI
Reliability
Campaign completion
Marketplace reputation

Useful for:
Sponsors
Investors
Lenders
Labels
Managers

DATA ADVANTAGE / MOAT

As users use the route planner, HYPED collects valuable aggregate market data.

Data Collected Over Time:
Popular touring routes
City demand trends
Artist growth patterns
Market conversion signals
Promo city clusters
Venue demand clusters
Genre-market fit
Route performance
Marketplace staffing demand
Campaign success data
Sponsor fit data
Worker reliability data

This data powers:
Smarter route recommendations
Marketplace staffing predictions
Sponsor matching
Financing decisions
B2B dashboards
AI tour manager
Ticket demand prediction
City opportunity scoring

Strategic Moat:
The more artists use HYPED, the smarter the market activation engine becomes.

BUSINESS MODEL ROADMAP

MVP Revenue:
Subscription SaaS

Free Tier:
Connect accounts
Top 5 markets
1 route/month
Basic heat map
Limited city details

Pro Tier:
$19/month to $39/month

Pro Features:
Unlimited routes
Full market insights
Route exports
Saved plans
Saved cities
Notes/contact vault
Advanced city pages
More detailed opportunity scoring

Future Revenue Streams:
Marketplace commission, 15% to 30%
Featured vendor listings
Brand campaign fees
Sponsor matchmaking fees
B2B label/manager dashboards
Premium data reports
AI route intelligence
Financing/revenue share
Local vendor partnerships
Route export/proposal tools
Campaign recap reports

FOUNDING STRATEGY

Start narrow:
Indie artist route planner.

Expand from leverage:
Marketplace, staffing, sponsors, financing, B2B dashboards.

Why This Works:
Artists are easy to acquire compared to enterprise brands.
Artists feel the pain immediately.
Streaming data creates a personalized wow moment.
Route planning creates real utility.
Saved plans create repeat usage.
Export/share creates organic distribution.
Marketplace demand naturally appears after route creation.

Core Strategy:
Do not start with a generic community.
Do not start with a bloated marketplace.
Do not start with social features.

Start with money movement:
Help artists waste less money, pick better cities, and turn fan demand into real-world growth.

MVP Priority Order

Build in this order:
1. Onboarding and mock platform connection
2. Dashboard with artist insights
3. Heat map / city demand visualization
4. Smart route builder
5. City opportunity pages
6. Saved cities and notes
7. Share/export route preview
8. Profile/settings

Suggested Build Timeline:
Week 1:
Auth or mock auth
Artist onboarding
Mock platform connection
Mock data structure

Week 2:
Dashboard
Top markets
Heat map visualization
City ranking

Week 3:
Route builder
Route scoring
Route results
City detail pages

Week 4:
Saved cities
Notes
Route detail
Export/share preview
Mobile polish
Investor-demo polish

FINAL PRODUCT PRINCIPLE

Every MVP screen should answer one of these questions:
Where are my fans?
Which cities matter most?
What route should I take?
Why should I go there?
What should I do next?
How do I save/share this plan?

The MVP is not trying to build the entire future company.
The MVP is designed to prove the wedge:
Artists want to turn listener data into real-world promo routes.

Once that wedge works, the marketplace becomes the natural next layer.