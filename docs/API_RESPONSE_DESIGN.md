## 💻 API Response Design Documentation

This document describes the structure and format of **API responses** that the client will receive from the backend service. It ensures consistent error handling, data structure, and messaging for all API responses.

-----

## Table of Contents

  - [Overview](https://www.google.com/search?q=%23overview)
  - [Response Structure](https://www.google.com/search?q=%23response-structure)
  - [Status Codes](https://www.google.com/search?q=%23status-codes)
  - [Error Handling](https://www.google.com/search?q=%23error-handling)
  - [Example Responses](https://www.google.com/search?q=%23example-responses)
      - [Success Response](https://www.google.com/search?q=%23success-response)
      - [Error Response](https://www.google.com/search?q=%23error-response)
      - [Empty Data Response](https://www.google.com/search?q=%23empty-data-response)
      - [Server Error Response](https://www.google.com/search?q=%23server-error-response)
  - [Client Usage](https://www.google.com/search?q=%23client-usage)
      - [Handling Success](https://www.google.com/search?q=%23handling-success)
      - [Handling Errors](https://www.google.com/search?q=%23handling-errors)

-----

## Overview

API responses from the service will always follow a standard **JSON structure**. This structure helps ensure consistent communication between the client and the backend service. The response will include a `status` indicating whether the request was successful or not, a `message` providing context, and the `data` containing the requested information or results.

### Common Fields

  - **`status`**: Indicates whether the request was successful or not. (`success`, `error`)
  - **`message`**: A message that provides more context about the request (either success or error).
  - **`data`**: Contains the actual data being returned from the server (if any).
  - **`error`**: Details about the error if one occurred (only present in case of failure).
  - **`errorCode`**: A code that identifies the specific error type (if applicable).

-----

## Response Structure

All responses will follow the structure outlined below:

```json
{
  "status": "string",      // 'success' or 'error'
  "message": "string",     // Success or error message
  "data": "object | array | null",  // Data to return (null if no data)
  "error": "string | null",       // Error details (null if no error)
  "errorCode": "number | null"    // Error code (optional)
}
```

**Fields Breakdown:**

  * **`status`**:
      * **Values**: `success`, `error`
      * Describes the outcome of the request.
  * **`message`**: A string that provides a **user-friendly message** about the outcome. In case of errors, it explains what went wrong.
  * **`data`**: Can be any valid JSON object or array that contains the data requested. If no data is available (e.g., an empty result), this field will be `null` or an empty array.
  * **`error`**: A string that contains the **error description** (if an error occurred). This could be something like `IncorrectPasswordException` or `ValidationError`.
  * **`errorCode`**: An optional string or number that uniquely identifies the error (e.g., `400` for bad request).

-----

## Status Codes

Here is a table of the most common **HTTP status codes** that the API may return:

| Status Code | Meaning | Description |
| :---: | :---: | :--- |
| **200** | OK | The request was successful, and the response contains the data. |
| **201** | Created | The request was successful, and a resource was created. |
| **400** | Bad Request | The request was invalid, typically due to missing or malformed parameters. |
| **401** | Unauthorized | Authentication failed or the user is not authorized to perform the requested action. |
| **403** | Forbidden | The server understood the request, but the user does not have permission to perform the action. |
| **404** | Not Found | The requested resource could not be found. |
| **422** | Unprocessable Entity | The request was well-formed but contained invalid data (e.g., validation errors). |
| **500** | Internal Server Error | There was an error on the server while processing the request. |
| **502** | Bad Gateway | The server received an invalid response from the upstream server. |

-----

## 🚫 Error Handling

When an error occurs, the response will include a `status` of **`error`**, and an **`error`** field with a description of the problem. The **`message`** field will provide additional context or user-friendly messages.

### Common Error Types

  * **Validation Errors**: If the data provided by the client doesn't meet the API's requirements (e.g., missing required fields, invalid data types).
  * **Authentication Errors**: If the user is not authorized or the token is expired.
  * **Permission Errors**: If the user is trying to perform an action that they are not allowed to do.
  * **Server Errors**: If something goes wrong on the server side (e.g., database failures, unhandled exceptions).

### Example Error Messages

  * "Invalid email format"
  * "Password must be at least 8 characters"
  * "Unauthorized access"

### Error Code Mapping

Below are some examples of common error codes and their meanings:

| Error Code | Description |
| :---: | :--- |
| **400** | Bad request (missing parameters, invalid data) |
| **401** | Unauthorized (invalid credentials) |
| **403** | Forbidden (insufficient permissions) |
| **404** | Not found (resource doesn't exist) |
| **422** | Validation error (invalid data) |
| **500** | Internal server error (unexpected issues on the server) |

-----

## 📝 Example Responses

### Success Response

A successful request will return the requested data.

```json
{
  "status": "success",
  "message": "Profile fetched successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com"
  },
  "error": null,
  "errorCode": null
}
```

### Error Response

When an error occurs, a detailed error message and error code will be returned.

```json
{
  "status": "error",
  "message": "Incorrect password",
  "data": null,
  "error": "IncorrectPasswordException",
  "errorCode": 400
}
```

### Empty Data Response

When no data is found (for example, an empty list), the `data` field will be an empty array or `null`.

```json
{
  "status": "success",
  "message": "No profiles found",
  "data": [],
  "error": null,
  "errorCode": null
}
```

### Server Error Response

If there's an issue on the server side, the `status` will be `error`, and the message will describe the error.

```json
{
  "status": "error",
  "message": "Internal Server Error",
  "data": null,
  "error": "InternalError",
  "errorCode": 500
}
```

-----

## ⚙️ Client Usage

### Handling Success

When handling a success response, the client should:

1.  Check if `status` is **`"success"`**.
2.  Process the **`data`** field and render it in the UI.

> For example, when you get the profile data in the response, you can update the UI with the user's profile details.

```javascript
if (response.status === 'success') {
  const userData = response.data;
  // Render user profile in UI
}
```

### Handling Errors

When handling an error response, the client should:

1.  Check if `status` is **`"error"`**.
2.  Display the **`message`** in the UI to inform the user of the issue.
3.  Use **`errorCode`** and **`error`** for further error diagnostics if necessary.

> For example, if you receive a `IncorrectPasswordException`, you could display a message like: "Current password is incorrect. Please try again."

```javascript
if (response.status === 'error') {
  const errorMessage = response.message;
  // Display error message in UI
}
```