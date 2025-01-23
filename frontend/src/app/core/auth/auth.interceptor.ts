import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Skip for login/register/langchain endpoints
  if (req.url.includes('/auth/signin') || req.url.includes('/auth/signup') || req.url.includes('prod-upload-langchain')) {
    return next(req);
  }
  const modifiedReq = req.clone({
    withCredentials: true
  });
  return next(modifiedReq);
};