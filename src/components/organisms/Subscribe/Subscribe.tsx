import React, { useState } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import Heading from "../../atoms/Heading/Heading";

const Subscribe: React.FC = () => {
  const [email, setEmail] = useState("");
  return (
    <section className="bg-yellow-300 py-12 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <Heading 
          level={2} 
          style={{ fontFamily: "Neurial Grotesk" }}
        >
          Subscribe to get update every new course
        </Heading>
        <p className="text-sm mb-6 max-w-xl mx-auto text-[#1E1E1E]">
          Get notified about new courses, discounts, and special offers.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Subscribed: ${email}`);
            setEmail("");
          }}
          className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            placeholder="Enter your email address"
            required
          />
          <Button type="submit" variant="secondary">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default Subscribe;