// DRAFT templates. Replace [BRACKETS] and have a UK solicitor review before launch.
const co = '[COMPANY NAME] Ltd, registered in England and Wales, company number [NUMBER], registered office [ADDRESS] ("VeriPlate", "we", "us")';
export const legal = {
  privacy: { title: 'Privacy Policy', updated: '[DATE]', sections: [
    ['Who we are', `${co}. We are the controller of your personal data. Contact: [EMAIL].`],
    ['What we collect', 'Waitlist: your email address, the quantity you are interested in, and whether you agreed to marketing. Orders (once live): name, delivery address, email and payment confirmation (card details are handled by our payment provider, never stored by us). Vehicle data: the VIN, number plate and model that an administrator links to a tag. Tag taps: a timestamp and the tag code, with no phone or personal identifiers stored. Technical logs: IP address and browser data kept briefly for security.'],
    ['Why and our lawful basis', 'To run the waitlist and contact you about launch (consent / legitimate interests); to fulfil orders (contract); to verify tags and prevent fraud (legitimate interests); to meet legal obligations. Marketing emails only with your consent, which you can withdraw at any time.'],
    ['Who we share it with', 'Service providers acting on our instructions: database hosting (Supabase), website hosting, email delivery and payment processing. We do not sell your data. Some providers may process data outside the UK under UK-approved safeguards.'],
    ['How long we keep it', 'Waitlist data until launch plus 12 months, or until you ask us to delete it. Order records for 6 years for tax and legal reasons. Tag and vehicle records while the tag is in service and 12 months after.'],
    ['Your rights', 'Under UK GDPR you can ask for access, correction, deletion, restriction, portability, and to object to processing. Email [EMAIL]. You can complain to the Information Commissioner\'s Office at ico.org.uk.'],
    ['Cookies', 'We only use essential cookies (for example admin sign-in). We do not use advertising or analytics cookies.'],
    ['Changes', 'We will post updates on this page with a new date.'],
  ]},
  refunds: { title: 'Refund Policy', updated: '[DATE]', sections: [
    ['Summary', 'Each VeriPlate tag is programmed and linked to your vehicle\'s VIN and registration, so it is made to your specifications. Because of this, the 14 day cancellation right for distance sales does not apply once we have started preparing your tag (Consumer Contracts Regulations 2013, reg. 28). We do not offer refunds for change of mind.'],
    ['When you will get a refund', 'We will refund or replace your order, at your choice, if: your order does not arrive within [30] days of dispatch; the tag arrives damaged or does not work; or we sent the wrong item or the wrong vehicle details through our error.'],
    ['How to claim', 'Email [EMAIL] within 14 days of the expected delivery date (or of delivery for faulty items) with your order number and, if relevant, photos. Refunds go to the original payment method within 14 days of us agreeing the claim.'],
    ['Wrong details supplied by you', 'If you gave us the wrong VIN or plate, contact us before dispatch and we will correct it free. After dispatch we may charge a reprogramming fee.'],
    ['Your legal rights', 'Nothing in this policy affects your statutory rights under the Consumer Rights Act 2015, including the right to a repair, replacement or refund for goods that are faulty, not as described or not fit for purpose.'],
    ['Waitlist', 'Joining the waitlist is free and creates no obligation. No payment is taken until an order opens.'],
  ]},
  terms: { title: 'Terms & Conditions', updated: '[DATE]', sections: [
    ['About us', `${co}. Contact: [EMAIL].`],
    ['What we provide', 'NFC tags linked to a vehicle\'s VIN and registration. Tapping a tag with a compatible phone opens a VeriPlate page showing the vehicle details we hold and steps to check them. VeriPlate is a verification aid. It is not a guarantee against theft or cloning, not an official vehicle record, and not a substitute for checking the vehicle with the DVLA, the V5C logbook or a history check provider.'],
    ['Waitlist and orders', 'Joining the waitlist does not form a contract. Launch pricing is £10 for one tag and £15 for two, including VAT where applicable; delivery cost will be shown before you pay. A contract is formed when we confirm your order by email. We may limit quantities.'],
    ['Your responsibilities', 'You must only order for vehicles you own or are authorised to manage, give accurate VIN and registration details, and not tamper with, copy or misuse tags or our verification pages. Verification links are time limited by design.'],
    ['Flagged and disabled tags', 'We may disable a tag, with a recorded reason, if we suspect fraud, a mismatch, misuse or a change of ownership. A disabled tag displays a warning to anyone who taps it.'],
    ['Changing vehicle details', 'If you transfer a private plate or sell your vehicle, contact us so we can update or disable the tag. Details are only changed after we are satisfied the request is genuine.'],
    ['Delivery, returns and refunds', 'See our Refund Policy, which forms part of these terms.'],
    ['Liability', 'We do not exclude liability for death or personal injury caused by negligence, fraud, or anything that cannot be excluded by law. Otherwise our total liability for any claim is limited to the price you paid, and we are not liable for indirect or consequential loss.'],
    ['Data', 'See our Privacy Policy.'],
    ['General', 'We may update these terms; the version at the time of your order applies to it. These terms are governed by the law of England and Wales and the courts of England and Wales have jurisdiction (consumers in Scotland or Northern Ireland may use their local courts).'],
  ]},
};
