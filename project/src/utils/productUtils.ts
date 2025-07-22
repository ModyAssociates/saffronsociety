// Utility function to decode HTML entities
export const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// Utility function to format Printify description
export const formatPrintifyDescription = (description: string): string => {
  if (!description) return ''
  
  // Decode HTML entities first
  let cleanDescription = decodeHTMLEntities(description)
  
  // Remove any leading dashes, periods, or whitespace
  cleanDescription = cleanDescription.replace(/^[-–—.\s]+/, '').trim()
  
  // Remove the Design Highlights section from the description
  cleanDescription = cleanDescription.replace(/🎨\s*Design Highlights[^🎬🎭🎪🎯🔥]*/s, '')
  
  // First, let's identify if there's a final sentence that should be bolded
  const sentences = cleanDescription.split(/(?<=[.!?])\s+/)
  const lastSentence = sentences[sentences.length - 1]?.trim()
  
  // Check if the last sentence is substantial and doesn't start with an emoji
  const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}]/u
  const shouldBoldLastSentence = lastSentence && 
    lastSentence.length > 20 && 
    !emojiRegex.test(lastSentence) &&
    !lastSentence.includes(':') // Not a list item
  
  // Remove the last sentence from the description if we're going to bold it
  let descriptionToProcess = cleanDescription
  if (shouldBoldLastSentence) {
    descriptionToProcess = cleanDescription.substring(0, cleanDescription.lastIndexOf(lastSentence)).trim()
  }

  // Split by sentences that start with emojis
  // Look for emoji at the start of a sentence or after a period
  const emojiSentenceRegex = /(?:^|\.\s*)([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F0F5}])\s*/gu

  // Find all emoji matches
  const matches = Array.from(descriptionToProcess.matchAll(emojiSentenceRegex))
  
  if (matches.length === 0) {
    // No emojis found, return as simple paragraph
    let html = `<p>${descriptionToProcess}</p>`
    if (shouldBoldLastSentence) {
      html += `<p class="font-bold text-gray-900 mt-6 text-center">${lastSentence}</p>`
    }
    return html
  }
  
  let formattedHtml = ''
  
  // Process content before first emoji
  if (matches[0].index > 0) {
    const beforeFirst = descriptionToProcess.substring(0, matches[0].index).trim()
    if (beforeFirst && beforeFirst.length > 10) {
      formattedHtml += `<p>${beforeFirst}</p>`
    }
  }
  
  // Process each emoji section
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const emoji = match[1]
    const startIndex = match.index + match[0].length
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : descriptionToProcess.length
    
    const content = descriptionToProcess.substring(startIndex, endIndex).trim()
    
    if (content) {
      // Split content by colon to separate heading from description
      const colonIndex = content.indexOf(':')
      
      if (colonIndex !== -1) {
        const heading = content.substring(0, colonIndex).trim()
        const description = content.substring(colonIndex + 1).trim()
        
        if (heading) {
          formattedHtml += `<h3>${emoji} ${heading}</h3>`
        }
        if (description) {
          // Check if this is Design Highlights section and format as list
          if (heading.toLowerCase().includes('design highlight')) {
            // For Design Highlights, we need to parse the content differently
            // Split by periods and look for patterns with colons
            const items = []
            const sentences = description.split(/\.\s*/)

            for (const sentence of sentences) {
              const trimmedSentence = sentence.trim()
              if (!trimmedSentence || trimmedSentence.length < 5) continue
              
              // Remove all emojis from the sentence first
              const cleanSentence = trimmedSentence.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}]/gu, '').trim()
              
              const colonIndex = cleanSentence.indexOf(':')
              if (colonIndex !== -1 && colonIndex < 50) {
                // This looks like a title: description pattern
                const itemTitle = cleanSentence.substring(0, colonIndex).trim()
                const itemDesc = cleanSentence.substring(colonIndex + 1).trim()
                
                if (itemTitle && itemDesc) {
                  items.push(`<li><strong>${itemTitle}:</strong> ${itemDesc}</li>`)
                }
              } else if (cleanSentence) {
                // No colon, treat as a regular item
                items.push(`<li>${cleanSentence}</li>`)
              }
            }
            
            if (items.length > 0) {
              formattedHtml += `<ul class="list-disc space-y-2 ml-4 text-gray-700">${items.join('')}</ul>`
            } else {
              // Fallback to paragraph if no items were parsed
              const cleanDesc = description.replace(/\.$/, '').trim()
              formattedHtml += `<p>${cleanDesc}</p>`
            }
          } else {
            // Regular paragraph formatting for other sections
            const cleanDesc = description.replace(/\.$/, '').trim()
            formattedHtml += `<p>${cleanDesc}</p>`
          }
        }
      } else {
        // No colon, treat as heading with possible description after period
        const periodIndex = content.indexOf('.')
        if (periodIndex !== -1 && periodIndex < 50) {
          // Short text before period - likely a heading
          const heading = content.substring(0, periodIndex).trim()
          const description = content.substring(periodIndex + 1).trim()
          
          formattedHtml += `<h3>${emoji} ${heading}</h3>`
          if (description) {
            formattedHtml += `<p>${description}</p>`
          }
        } else {
          // Treat whole content as heading
          const cleanContent = content.replace(/\.$/, '').trim()
          formattedHtml += `<h3>${emoji} ${cleanContent}</h3>`
        }
      }
    }
  }
  
  // Add the final bolded sentence if we identified one
  if (shouldBoldLastSentence) {
    formattedHtml += `<p class="font-bold text-gray-900 mt-6 text-center">${lastSentence}</p>`
  }

  return formattedHtml
}

// Parse design highlights from the description
export const parseDesignHighlights = (description: string): Array<{title: string, description: string}> => {
  const highlights: Array<{title: string, description: string}> = []
  
  // Look for the Design Highlights section in the description
  const designHighlightsMatch = description.match(/🎨\s*Design Highlights[^🎬🎭🎪🎯🔥]*/s)
  if (!designHighlightsMatch) return highlights
  
  const highlightsContent = designHighlightsMatch[0]
  
  // Split by lines and parse each item
  const lines = highlightsContent.split('\n').filter(line => line.trim())
  
  for (const line of lines) {
    // Skip the header line
    if (line.includes('Design Highlights')) continue
    
    // Remove bullet points, dashes, asterisks, and emojis
    const cleanLine = line
      .replace(/^[•\-*]\s*/, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .trim()
    
    if (!cleanLine) continue
    
    // Split by colon to get title and description
    const colonIndex = cleanLine.indexOf(':')
    if (colonIndex > 0 && colonIndex < 50) {
      const title = cleanLine.substring(0, colonIndex).trim()
      const description = cleanLine.substring(colonIndex + 1).trim()
      if (title && description) {
        highlights.push({ title, description })
      }
    }
  }
  
  return highlights
}
