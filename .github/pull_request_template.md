name: Pull Request
about: Propose changes to the project
title: '[Feature]: ' 
labels: enhancement
assignees: ''
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What does this PR change?
    validations:
      required: true
  - type: textarea
    id: test-plan
    attributes:
      label: Test Plan
      description: How did you test this?
    validations:
      required: true
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: Optional UI screenshots/gifs
