"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { toast } from "sonner";

const NOW = Date.now();

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
  productName: string;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  content: string;
  date: Date;
}

export function ReviewCard({ review: initialReview }: { review: Review }) {
  const [review, setReview] = useState(initialReview);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [responseText, setResponseText] = useState(review.response?.content || '');

  const handleSubmitResponse = () => {
    if (responseText.length < 20) {
      toast.error('Réponse trop courte', {
        description: 'La réponse doit contenir au moins 20 caractères.',
      });
      return;
    }

    const newResponse: ReviewResponse = {
      content: responseText,
      date: new Date(),
    };

    setReview({ ...review, response: newResponse });
    setIsReplying(false);
    setIsEditing(false);

    toast.success('Réponse publiée', {
      description: 'Votre réponse a été publiée avec succès.',
    });
  };

  const handleEditResponse = () => {
    setResponseText(review.response!.content);
    setIsEditing(true);
  };

  const handleDeleteResponse = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      setReview({ ...review, response: undefined });
      setResponseText('');
      
      toast.success('Réponse supprimée', {
        description: 'Votre réponse a été supprimée.',
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const daysSince = (date: Date) => {
    const days = Math.floor((NOW - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Avis client */}
        <div className="space-y-4">
          {/* En-tête */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={review.customerAvatar} />
                <AvatarFallback>{getInitials(review.customerName)}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.customerName}</span>
                  {review.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Achat vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    • {daysSince(review.date)}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Produit: {review.productName}
                </p>
              </div>
            </div>
          </div>

          {/* Commentaire */}
          <p className="text-sm">{review.comment}</p>

          {/* Actions */}
          {!review.response && !isReplying && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReplying(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Répondre
            </Button>
          )}

          {/* Formulaire de réponse */}
          {(isReplying || isEditing) && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isEditing ? 'Modifier votre réponse' : 'Votre réponse publique'}
                </span>
              </div>

              <Textarea
                placeholder="Rédigez votre réponse..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                maxLength={500}
                rows={4}
                className="resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {responseText.length}/500 caractères
                  </p>
                  {responseText.length < 20 && responseText.length > 0 && (
                    <p className="text-xs text-destructive">
                      Minimum 20 caractères requis
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      setIsEditing(false);
                      setResponseText(review.response?.content || '');
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitResponse}
                    disabled={responseText.length < 20}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {isEditing ? 'Modifier' : 'Publier'}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                  💡 Conseils pour répondre
                </p>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Restez professionnel et courtois</li>
                  <li>• Remerciez le client pour son retour</li>
                  <li>• Proposez une solution si un problème est mentionné</li>
                </ul>
              </div>
            </div>
          )}

          {/* Réponse existante */}
          {review.response && !isEditing && (
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Réponse du vendeur
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {daysSince(review.response.date)}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleEditResponse}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={handleDeleteResponse}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <p className="text-sm">{review.response.content}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
