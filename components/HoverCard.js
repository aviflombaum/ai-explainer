import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import endent from 'endent';

function HoverCard() {
  const [explanationLinkVisible, setExplanationLinkVisible] = useState(false);
  const [newExplanation, setNewExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasExplanation, setHasExplanation] = useState(false);

  const handleExplanation = async (e) => {
    const maxCodeLength = 6000;
    const paragraphText = e.currentTarget.parentNode.nextSibling.innerText;

    setLoading(true);
    setNewExplanation('');

    const controller = new AbortController();

    const response = await fetch('/api/explanation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({ paragraphText }),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setNewExplanation((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasExplanation(true);
    console.log(code);
  };

  const handleTextSelect = (e) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      console.log('Selected text:', selectedText, explanationLinkVisible);
      // Perform your desired action with the selected text
      setExplanationLinkVisible(true);
    }
  };

  const toggleExplanationLink = (e) => {
    setExplanationLinkVisible(!explanationLinkVisible);
  };

  const explanationClasses = classNames('absolute', 'text-right', 'w-11/12', {
    visibile: explanationLinkVisible,
    hidden: !explanationLinkVisible,
  });

  const cardClasses = classNames('bg-white', 'p-4', 'rounded-lg', 'shadow-md');

  const textClasses = classNames(
    'text-gray-700',
    'font-medium',
    'text-lg',
    'mb-2',
  );

  return (
    <div
      className={cardClasses}
      onMouseEnter={toggleExplanationLink}
      onMouseLeave={toggleExplanationLink}
    >
      <div className={explanationClasses}>
        <button
          className="bg-white text-lg text-blue-800 underline"
          onClick={handleExplanation}
        >
          Get another Explanation
        </button>
      </div>
      <div>
        <p className="text-gray-600">
          {newExplanation
            ? newExplanation
            : endent`
            Components often need to change what’s on the screen as a result of an
            interaction. Typing into the form should update the input field,
            clicking “next” on an image carousel should change which image is
            displayed, clicking “buy” puts a product in the shopping cart.
            Components need to “remember” things: the current input value, the
            current image, the shopping cart. In React, this kind of
            component-specific memory is called state.`}
        </p>
      </div>
    </div>
  );
}

export default HoverCard;
